// naruto-nx: the build's entry of release/manifest.json from your own disc and the NRO, with the page's code (the
// same steps as naruto_worker.js), and the zip it makes.
// Usage: node test/naruto_manifest.mjs <game folder> <naruto.nro> <version> <native glsl_opt folder> [--zip out.zip]
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { loadModules, root } from './node_files.mjs';
import createUamWebModule from '../wasm/uam_web.mjs';
import { lzxStep } from '../lib/lzx.js';
import { readXexImage } from '../lib/xex.js';
import { buildDeko3dPackage, narutoContainers, SA2_DEKO3D_PASSES } from '../lib/deko3d.js';
import { buildDkshCache } from '../lib/deko3d_cache.js';
const args = process.argv.slice(2);
const at = args.indexOf('--zip'); const zipOut = at >= 0 ? args.splice(at, 2)[1] : null;
const [game, nroPath, version, reference] = args;
const sha = (b) => createHash('sha256').update(b).digest('hex');
const RUNTIME = new Set(['ps_CFF1F16A5DE43698', 'vs_1C09DC313D5EC669']);
const modules = await loadModules();
const xex = fs.readFileSync(path.join(game, 'default.xex'));
const { image } = await readXexImage(new Uint8Array(xex), lzxStep(modules.lzx));
const sdb = new Uint8Array(fs.readFileSync(path.join(game, 'xeshader.sdb')));
const unique = []; const seen = new Set();
for (const c of narutoContainers(image, sdb)) { const h = sha(c.bytes); if (!seen.has(h)) { seen.add(h); unique.push(c); } }
const names = fs.readdirSync(reference).filter((f) => /^(vs|ps)_[0-9A-F]{16}\.glsl$/.test(f)).map((f) => f.slice(0, -5))
  .filter((n) => !RUNTIME.has(n)).sort();
const common = fs.readFileSync(path.join(root, 'renut_shader_common.h'));
const { package: pkg, shaders } = await buildDeko3dPackage(unique, names, SA2_DEKO3D_PASSES, modules, common);
const variants = JSON.parse(fs.readFileSync(path.join(root, 'release', 'deko3d_variants.json'), 'utf8'));
const uam = await createUamWebModule({ print: () => {}, printErr: () => {} });
const { cache, failed, mismatched } = buildDkshCache(new Map(shaders.map((s) => [s.name, s.glsl])), variants, uam, console.log);
const nro = fs.readFileSync(nroPath);
const build = {
  version, nro: 'naruto.nro', nro_sha256: sha(nro), nro_size: nro.length, xex_sha256: sha(xex),
  deko3d: { passes: SA2_DEKO3D_PASSES, shaders: names, containers_sha256: [...seen].sort(), package_sha256: sha(pkg) },
  variants: 'deko3d_variants.json', cache_sha256: sha(cache),
};
fs.writeFileSync(path.join(root, 'release', 'manifest.json'), JSON.stringify({ builds: [build] }, null, 1) + '\n');
console.log(`manifest: ${version}; package ${sha(pkg)}; cache ${cache.length} bytes (${failed} failed, ${mismatched} keys not the list's)`);
if (zipOut) {
  const { ZipWriter } = await import('../lib/zip.js');
  const parts = [];
  const zip = new ZipWriter({ write: async (b) => { parts.push(Buffer.from(b)); }, close: async () => {} });
  await zip.addBytes('switch/naruto-nx/naruto.nro', nro);
  await zip.addBytes('switch/naruto-nx/LICENSES.txt', fs.readFileSync(path.join(root, 'release', 'LICENSES.txt')));
  await zip.addBytes('switch/naruto-nx/deko3d_glsl.bin', pkg);
  await zip.addBytes('switch/naruto-nx/deko3d_shaders.bin', cache);
  await zip.finish();
  fs.writeFileSync(zipOut, Buffer.concat(parts));
  console.log('zip', zipOut);
}
