// Builds the shader library from a game package (or an extracted game folder) in Node, with the same code as the page,
// and prints the fingerprints the build's entry in release/manifest.json needs. With a folder of reference containers
// (*.bin, e.g. the ones the native library was built from) it also says which containers match them.
// Usage: node test/library_node.mjs <game package or folder> [reference containers folder] [--out <folder>]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chosenOnDisk, loadModules, root } from './node_files.mjs';
import { findGame } from '../lib/installer.js';
import { readXexImage } from '../lib/xex.js';
import { buildShaderLibrary, containersFingerprint, shaderContainers } from '../lib/shaders.js';
import { lzxStep } from '../lib/installer.js';

const args = process.argv.slice(2);
const outAt = args.indexOf('--out');
const out = outAt >= 0 ? args.splice(outAt, 2)[1] : null;
const [input, reference] = args;
const sha = (b) => createHash('sha256').update(b).digest('hex');
const started = Date.now();

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release/manifest.json'), 'utf8'));
const recipe = manifest.builds[0].shaders;
const { game } = await findGame(chosenOnDisk([input]));
const xexFile = game.files.find((f) => f.path.toLowerCase() === 'default.xex');
const xex = await xexFile.read(0, xexFile.size);
const modules = await loadModules();
const { image } = await readXexImage(xex, lzxStep(modules.lzx));
console.log(`default.xex SHA-256 ${sha(xex)}; image ${image.length} bytes, SHA-256 ${sha(image)}`);

const folder = recipe.folder.toLowerCase() + '/';
const gameShaders = new Map();
for (const f of game.files) {
  const p = f.path.toLowerCase();
  if (p.startsWith(folder) && /\.(wpu|wvu)$/.test(p) && !p.slice(folder.length).includes('/')) {
    gameShaders.set(p.slice(folder.length), await f.read(0, f.size));
  }
}
const containers = shaderContainers(recipe, gameShaders, image);
console.log(`${containers.length} containers (${gameShaders.size} game files), fingerprint ${await containersFingerprint(containers)}`);
if (reference) {
  const refs = new Map(fs.readdirSync(reference).filter((n) => n.endsWith('.bin'))
    .map((n) => [sha(fs.readFileSync(path.join(reference, n))), n]));
  let same = 0;
  for (const c of containers) {
    const name = refs.get(sha(c.bytes));
    if (name) {
      same++;
      refs.delete(sha(c.bytes));
    } else {
      console.log(`  ${c.name}: not among the reference containers`);
    }
  }
  console.log(`  ${same} of ${containers.length} identical to a reference container; not made: ${[...refs.values()].join(', ') || 'none'}`);
}
const shaderCommon = new Uint8Array(fs.readFileSync(path.join(root, 'shader_common.h')));
const { library, index } = await buildShaderLibrary(containers, modules, shaderCommon, (t) => console.log(t));
console.log(`library ${library.length} bytes, SHA-256 ${sha(library)}`);
console.log(`index ${index.length} bytes, SHA-256 ${sha(index)}`);
if (out) {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'sa2_shaders.mesp'), library);
  fs.writeFileSync(path.join(out, 'sa2_shaders.mesp.idx'), index);
  fs.mkdirSync(path.join(out, 'in'), { recursive: true });
  fs.mkdirSync(path.join(out, 'hlsl'), { recursive: true });
  fs.mkdirSync(path.join(out, 'spirv'), { recursive: true });
  for (const c of containers) {
    const stem = c.name.slice(0, -4);
    fs.writeFileSync(path.join(out, 'in', c.name), c.bytes);
    fs.writeFileSync(path.join(out, 'hlsl', `${stem}.hlsl`), modules.hlsl.FS.readFile(`/out/${stem}.hlsl`));
    fs.writeFileSync(path.join(out, 'spirv', `${stem}.spv`), modules.pack.FS.readFile(`/spirv/${stem}.spv`));
  }
  console.log(`written to ${out}`);
}
console.log(`${((Date.now() - started) / 1000).toFixed(1)} s`);
