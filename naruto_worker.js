// naruto-nx: builds the SD card folder off the main thread: checks the disc, makes the game's shaders from it
// (deko3d_glsl.bin) and compiles them for the console (deko3d_shaders.bin), downloads the NRO, and returns the zip.
import createDxcModule from './wasm/dxc_web.mjs';
import createLzxModule from './wasm/lzx.mjs';
import createRenutHlslModule from './wasm/renut_hlsl.mjs';
import createSpirvCrossModule from './wasm/spirv_cross.mjs';
import createUamWebModule from './wasm/uam_web.mjs';
import { lzxStep } from './lib/lzx.js';
import { readXexImage } from './lib/xex.js';
import { buildDeko3dPackage, narutoContainers } from './lib/deko3d.js';
import { buildDkshCache } from './lib/deko3d_cache.js';
import { ZipWriter } from './lib/zip.js';

const log = (key, args = {}) => postMessage({ type: 'log', key, args });
const progress = (fraction) => postMessage({ type: 'progress', fraction });
// A new options object for every module: Emscripten's factory fills the object it is given in (FS, callMain...), so
// sharing one between modules mixes them up.
const quiet = () => ({ print: () => {}, printErr: () => {} });

async function sha256(bytes) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function fetchBytes(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

globalThis.onmessage = async ({ data }) => {
  try {
    const { xex, sdb, build } = data;  // xex, sdb: Uint8Array; build: the manifest's entry
    progress(0.01);
    log('loading');
    const [lzx, renutHlsl, dxc, spirvCross] = await Promise.all([createLzxModule(quiet()), createRenutHlslModule(quiet()),
      createDxcModule(quiet()), createSpirvCrossModule(quiet())]);
    const { image } = await readXexImage(xex, lzxStep(lzx));
    const wanted = new Set(build.deko3d.containers_sha256);
    const containers = [];
    const found = new Set();
    for (const c of narutoContainers(image, sdb)) {
      const h = await sha256(c.bytes);
      if (wanted.has(h) && !found.has(h)) { found.add(h); containers.push(c); }
    }
    if (found.size !== wanted.size) throw new Error(`shaders: ${found.size} of ${wanted.size} found on the disc`);
    log('translating', { count: build.deko3d.shaders.length });
    progress(0.05);
    const common = await fetchBytes('./renut_shader_common.h');
    const { package: pkg, shaders } = await buildDeko3dPackage(containers, build.deko3d.shaders, build.deko3d.passes,
      { renutHlsl, dxc, spirvCross }, common);
    const pkgHash = await sha256(pkg);
    if (pkgHash !== build.deko3d.package_sha256) throw new Error(`deko3d_glsl.bin: SHA-256 ${pkgHash}, not the tested package`);
    progress(0.6);
    log('compiling');
    const uam = await createUamWebModule(quiet());
    const variants = await (await fetch(`./release/${build.variants}`)).json();
    const glsl = new Map(shaders.map((s) => [s.name, s.glsl]));
    const { cache, failed } = buildDkshCache(glsl, variants, uam, () => {}, (f) => progress(0.6 + 0.3 * f));
    if (failed) throw new Error(`deko3d_shaders.bin: ${failed} shader variants failed to compile`);
    progress(0.92);
    log('downloading');
    const nro = await fetchBytes(`./release/${build.nro}?sha256=${build.nro_sha256}`);
    if ((await sha256(nro)) !== build.nro_sha256) throw new Error('naruto.nro: not the release\'s file');
    const licenses = await fetchBytes('./release/LICENSES.txt');
    const parts = [];
    const zip = new ZipWriter({ write: async (b) => { parts.push(b.slice()); }, close: async () => {} });
    await zip.addBytes('switch/naruto-nx/naruto.nro', nro);
    await zip.addBytes('switch/naruto-nx/LICENSES.txt', licenses);
    await zip.addBytes('switch/naruto-nx/deko3d_glsl.bin', pkg);
    await zip.addBytes('switch/naruto-nx/deko3d_shaders.bin', cache);
    await zip.addBytes('switch/naruto-nx/game/PUT_YOUR_GAME_FILES_HERE.txt', new TextEncoder().encode(
      'Copy every file of your extracted disc here (default.xex at the top of this folder).\n' +
      'Скопируйте сюда все файлы распакованного диска (default.xex в корне этой папки).\n'));
    await zip.finish();
    progress(1);
    postMessage({ type: 'done', zip: new Blob(parts, { type: 'application/zip' }), version: build.version });
  } catch (e) {
    postMessage({ type: 'error', message: String(e && e.message || e) });
  }
};
