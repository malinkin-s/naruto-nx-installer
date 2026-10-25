// naruto-nx: the DKSH cache from a GLSL folder and release/deko3d_variants.json, compared with a reference cache.
// Usage: node test/naruto_cache_node.mjs <glsl folder> <variants.json> [<reference deko3d_shaders.bin>] [--out file]
import fs from 'node:fs';
import path from 'node:path';
import createUamWebModule from '../wasm/uam_web.mjs';
import { buildDkshCache } from '../lib/deko3d_cache.js';
const args = process.argv.slice(2);
const at = args.indexOf('--out'); const out = at >= 0 ? args.splice(at, 2)[1] : null;
const [dir, variantsPath, reference] = args;
const shaders = new Map(fs.readdirSync(dir).filter((f) => f.endsWith('.glsl')).map((f) => [f.slice(0, -5), fs.readFileSync(path.join(dir, f), 'utf8')]));
const variants = JSON.parse(fs.readFileSync(variantsPath, 'utf8'));
const uam = await createUamWebModule({ print: () => {}, printErr: () => {} });
const t0 = Date.now();
const { cache, mismatched, failed } = buildDkshCache(shaders, variants, uam, console.log);
console.log(`${cache.length} bytes, ${mismatched} keys mismatched, ${failed} failed, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
if (out) fs.writeFileSync(out, cache);
if (reference) console.log('identical to the reference:', Buffer.compare(Buffer.from(cache), fs.readFileSync(reference)) === 0);
