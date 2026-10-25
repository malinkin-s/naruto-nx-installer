// naruto-nx: makes deko3d_glsl.bin from an extracted Naruto: Rise of a Ninja disc in Node, with the page's code, and
// compares every shader with naruto-nx's native GLSL (out/deko3d_shaders/glsl_opt of the port's tree).
// Usage: node test/naruto_deko3d_node.mjs <game folder> <native glsl_opt folder> [--out <file>]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { loadModules, root } from './node_files.mjs';
import { lzxStep } from '../lib/lzx.js';
import { readXexImage } from '../lib/xex.js';
import { buildDeko3dPackage, narutoContainers, SA2_DEKO3D_PASSES } from '../lib/deko3d.js';

const args = process.argv.slice(2);
const take = (flag) => { const at = args.indexOf(flag); return at >= 0 ? args.splice(at, 2)[1] : null; };
const out = take('--out');
const glslOut = take('--glsl-out');
const [game, reference] = args;
const sha = (b) => createHash('sha256').update(b).digest('hex');
const started = Date.now();
const modules = await loadModules();
const xex = new Uint8Array(fs.readFileSync(path.join(game, 'default.xex')));
const { image } = await readXexImage(xex, lzxStep(modules.lzx));
console.log(`default.xex SHA-256 ${sha(xex)}; image ${image.length} bytes`);
const sdb = new Uint8Array(fs.readFileSync(path.join(game, 'xeshader.sdb')));
const all = narutoContainers(image, sdb);
const unique = []; const seen = new Set();
for (const c of all) { const h = sha(c.bytes); if (!seen.has(h)) { seen.add(h); unique.push(c); } }
console.log(`${all.length} containers (${unique.length} distinct)`);
let names = fs.readdirSync(reference).filter((f) => /^(vs|ps)_[0-9A-F]{16}\.glsl$/.test(f)).map((f) => f.slice(0, -5)).sort();
// The shaders the game builds at run time (captured by Renut from guest memory, in no file of the disc): the NRO
// carries them itself (naruto-nx: tools/renut_release_shaders.py's built-in package).
const RUNTIME = new Set(['ps_CFF1F16A5DE43698', 'vs_1C09DC313D5EC669']);
names = names.filter((n) => !RUNTIME.has(n));
const common = fs.readFileSync(path.join(root, 'renut_shader_common.h'));
const { package: pkg, shaders } = await buildDeko3dPackage(unique, names, SA2_DEKO3D_PASSES, modules, common,
  (s) => console.log('  ' + s));
console.log('package', pkg.length, 'bytes, SHA-256', sha(pkg));
if (out) fs.writeFileSync(out, pkg);
if (glslOut) { fs.mkdirSync(glslOut, { recursive: true }); for (const s of shaders) fs.writeFileSync(path.join(glslOut, s.name + '.glsl'), s.glsl); }
let same = 0; const different = [];
for (const s of shaders) {
  const equal = fs.readFileSync(path.join(reference, s.name + '.glsl'), 'utf8') === s.glsl;
  same += equal ? 1 : 0;
  if (!equal) {
    different.push(s.name);
    if (out) { fs.mkdirSync(out + '.diff', { recursive: true }); fs.writeFileSync(path.join(out + '.diff', s.name + '.glsl'), s.glsl); }
  }
}
console.log(`${same} of ${shaders.length} identical to the native GLSL; ${different.length} different`);
console.log(`${((Date.now() - started) / 1000).toFixed(1)} s`);
