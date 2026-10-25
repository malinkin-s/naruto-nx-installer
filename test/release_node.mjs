// Updates the build's entry of release/manifest.json for a new release of sa2-nx: the NRO's SHA-256 and size, and
// the fingerprints of the game and of the shaders made from your package with the page's own code.
// The native renderer's shader recipe ("shaders": templates and the places of Direct3D's shaders in default.xex) is kept
// as it is; --no-library drops it with the library's fingerprints (sa2-nx 1.0.3 on: the NRO draws with the deko3d
// renderer only). --deko3d <entry.json> (test/deko3d_node.mjs --out's .manifest.json: the folder, the passes, the
// shaders' names and their containers' SHA-256) makes deko3d_glsl.bin again here and pins its SHA-256.
// Check first that the NRO was tested with those shaders.
// Usage: node test/release_node.mjs <game package or folder> <sa2.nro> [--version <x.y.z>] [--deko3d <entry.json>]
//                                   [--no-library] [--write]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chosenOnDisk, loadModules, root } from './node_files.mjs';
import { findGame, identifyGame, lzxStep } from '../lib/installer.js';
import { readXexImage } from '../lib/xex.js';
import { buildShaderLibrary, containersFingerprint, shaderContainers } from '../lib/shaders.js';
import { buildDeko3dPackage, sa2Containers } from '../lib/deko3d.js';
import { Fnv64, planPack } from '../lib/nxpack.js';

const args = process.argv.slice(2);
const take = (flag) => {
  const at = args.indexOf(flag);
  return at >= 0 ? args.splice(at, 2)[1] : null;
};
const write = args.includes('--write');
const noLibrary = args.includes('--no-library');
const version = take('--version');
const deko3dPath = take('--deko3d');
const [input, nroPath] = args.filter((a) => a !== '--write' && a !== '--no-library');
if (!input || !nroPath) {
  console.error('usage: node test/release_node.mjs <game package or folder> <sa2.nro> [--version <x.y.z>] ' +
                '[--deko3d <entry.json>] [--no-library] [--write]');
  process.exit(1);
}
const sha = (b) => createHash('sha256').update(b).digest('hex');
const manifestPath = path.join(root, 'release/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const build = manifest.builds[0];
const before = JSON.stringify(build);

const { game } = await findGame(chosenOnDisk([input]));
if (!game) {
  throw new Error(`no game in ${input}`);
}
const modules = await loadModules();
const { xex, xexHash } = await identifyGame(game.files, { builds: [] });
const { image } = await readXexImage(xex, lzxStep(modules.lzx));
build.xex_sha256 = xexHash;
build.image_sha256 = sha(image);

async function shaderFolder(name) {
  const folder = name.toLowerCase() + '/';
  const files = new Map();
  for (const f of game.files) {
    const p = f.path.toLowerCase();
    if (p.startsWith(folder) && /\.(wpu|wvu)$/.test(p) && !p.slice(folder.length).includes('/')) {
      files.set(p.slice(folder.length), await f.read(0, f.size));
    }
  }
  return files;
}

if (noLibrary) {
  for (const key of ['shaders', 'library_sha256', 'library_size', 'index_sha256', 'index_size']) {
    delete build[key];
  }
} else {
  const containers = shaderContainers(build.shaders, await shaderFolder(build.shaders.folder), image);
  build.shaders.containers_sha256 = await containersFingerprint(containers);
  const shaderCommon = new Uint8Array(fs.readFileSync(path.join(root, 'shader_common.h')));
  const { library, index } = await buildShaderLibrary(containers, modules, shaderCommon);
  build.library_sha256 = sha(library);
  build.library_size = library.length;
  build.index_sha256 = sha(index);
  build.index_size = index.length;
}

if (deko3dPath) {
  const entry = JSON.parse(fs.readFileSync(deko3dPath, 'utf8'));
  const wanted = new Set(entry.containers_sha256);
  const containers = [];
  const found = new Set();
  for (const c of sa2Containers(image, await shaderFolder(entry.folder))) {
    const h = sha(c.bytes);
    if (wanted.has(h) && !found.has(h)) {
      found.add(h);
      containers.push(c);
    }
  }
  if (found.size !== wanted.size) {
    throw new Error(`deko3d: ${found.size} of ${wanted.size} containers found`);
  }
  const common = new Uint8Array(fs.readFileSync(path.join(root, 'renut_shader_common.h')));
  const { package: pkg } = await buildDeko3dPackage(containers, entry.shaders, entry.passes, modules, common);
  if (entry.package_sha256 && entry.package_sha256 !== sha(pkg)) {
    throw new Error(`deko3d: the package made here (${sha(pkg)}) is not the entry's (${entry.package_sha256})`);
  }
  build.deko3d = { folder: entry.folder, passes: entry.passes, shaders: entry.shaders,
    containers_sha256: [...wanted].sort(), package_sha256: sha(pkg), package_size: pkg.length };
}

const plan = planPack(game.files);
const fnv = new Fnv64();
for (const item of plan.items) {
  for (let offset = 0; offset < item.file.size; offset += 16 << 20) {
    fnv.update(await item.file.read(offset, Math.min(16 << 20, item.file.size - offset)));
  }
}
build.game_files = plan.items.length;
build.game_bytes = game.files.reduce((sum, f) => sum + f.size, 0);
build.game_data_fnv = fnv.value().toString(16).padStart(16, '0');

const nro = fs.readFileSync(nroPath);
build.nro_sha256 = sha(nro);
build.nro_size = nro.length;
if (version) {
  build.version = version;
}

const old = JSON.parse(before);
for (const key of new Set([...Object.keys(old), ...Object.keys(build)])) {
  const a = JSON.stringify(old[key]);
  const b = JSON.stringify(build[key]);
  if (a !== b) {
    console.log(`${key}: ${(a || 'none').slice(0, 160)} -> ${(b || 'none').slice(0, 160)}`);
  }
}
if (write) {
  // the same layout as the file in the repository: one line per shader entry, one per pinned hash list
  const text = JSON.stringify(manifest, null, 2).replace(/\{\s+("stage"[^{}]*?)\s+\}/g,
    (_, body) => `{ ${body.replace(/\s*\n\s*/g, ' ')} }`).replace(/"templates": \{\s+([^{}]*?)\s+\}/,
    (_, body) => `"templates": { ${body.replace(/\s*\n\s*/g, ' ')} }`);
  fs.writeFileSync(manifestPath, text + '\n');
  fs.copyFileSync(nroPath, path.join(root, 'release', build.nro));
  console.log(`written: release/manifest.json, and ${nroPath} copied to release/${build.nro} for local tests`);
} else {
  console.log('(dry run: add --write to save)');
}
