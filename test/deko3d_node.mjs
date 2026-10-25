// Makes sa2-nx's deko3d_glsl.bin from the game (package or folder) in Node, with the page's code (lib/deko3d.js), and
// prints what the build's "deko3d" entry in release/manifest.json needs. With sa2-nx's native GLSL
// (out/deko3d_shaders/glsl_opt) it also compares the shaders text for text; the shaders made are the ones that folder
// holds (the build's list), or every translated one without it.
// Usage: node test/deko3d_node.mjs <Xbox 360 package or game folder> [<native glsl_opt folder>] [--out <file>]
//                                  [--passes a,b,c]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chosenOnDisk, loadModules, root } from './node_files.mjs';
import { findGame, lzxStep } from '../lib/installer.js';
import { readXexImage } from '../lib/xex.js';
import { buildDeko3dPackage, sa2Containers, SA2_DEKO3D_PASSES } from '../lib/deko3d.js';

const args = process.argv.slice(2);
const take = (flag) => {
  const at = args.indexOf(flag);
  return at >= 0 ? args.splice(at, 2)[1] : null;
};
const out = take('--out');
const passes = take('--passes') || SA2_DEKO3D_PASSES;
const [input, reference] = args;
const sha = (b) => createHash('sha256').update(b).digest('hex');
const started = Date.now();

const { game } = await findGame(chosenOnDisk([input]));
const modules = await loadModules();
const xexFile = game.files.find((f) => f.path.toLowerCase() === 'default.xex');
const xex = await xexFile.read(0, xexFile.size);
const { image } = await readXexImage(xex, lzxStep(modules.lzx));
console.log(`default.xex SHA-256 ${sha(xex)}; image ${image.length} bytes`);
const shaderFiles = new Map();
for (const f of game.files) {
  const p = f.path.toLowerCase();
  if (p.startsWith('shader/xbox360/obj/') && /\.(wpu|wvu)$/.test(p)) {
    shaderFiles.set(p.slice('shader/xbox360/obj/'.length), await f.read(0, f.size));
  }
}
const all = sa2Containers(image, shaderFiles);
const unique = [];
const seen = new Set();
for (const c of all) {
  const h = sha(c.bytes);
  if (!seen.has(h)) {
    seen.add(h);
    unique.push(c);
  }
}
console.log(`${all.length} containers (${unique.length} distinct; ${shaderFiles.size} shader files)`);
const common = fs.readFileSync(path.join(root, 'renut_shader_common.h'));
let names;
if (reference) {
  names = fs.readdirSync(reference).filter((f) => /^(vs|ps)_[0-9A-F]{16}\.glsl$/.test(f)).map((f) => f.slice(0, -5)).sort();
} else {
  names = null;
}
if (!names) {
  throw new Error('give the native glsl_opt folder: it names the build\'s shaders');
}
const { package: pkg, shaders } = await buildDeko3dPackage(unique, names, passes, modules, common,
  (s) => console.log('  ' + s));
const pins = [...seen].sort();
console.log('package', pkg.length, 'bytes, SHA-256', sha(pkg));
if (out) {
  fs.writeFileSync(out, pkg);
  fs.writeFileSync(out + '.manifest.json', JSON.stringify({ folder: 'Shader/xbox360/obj', passes, shaders: names,
    containers_sha256: pins, package_sha256: sha(pkg) }, null, 2) + '\n');
  console.log('written', out, 'and', out + '.manifest.json');
}
let same = 0;
const different = [];
for (const s of shaders) {
  const ref = path.join(reference, s.name + '.glsl');
  const equal = fs.existsSync(ref) && fs.readFileSync(ref, 'utf8') === s.glsl;
  same += equal ? 1 : 0;
  if (!equal) {
    different.push(s.name);
    if (out) {
      fs.mkdirSync(out + '.diff', { recursive: true });
      fs.writeFileSync(path.join(out + '.diff', s.name + '.glsl'), s.glsl);
    }
  }
}
console.log(`${same} of ${shaders.length} identical to the native GLSL${different.length ? '; different: ' + different.join(', ') : ''}`);
console.log(`${((Date.now() - started) / 1000).toFixed(1)} s`);
