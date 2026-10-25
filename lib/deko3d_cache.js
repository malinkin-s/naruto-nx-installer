// naruto-nx: deko3d_shaders.bin, the console's cache of compiled shader variants, made in the page so the console does
// not compile a shader the first time it is drawn (stutters, a core at 100 %). Each variant is one stage of a pipeline
// the game drew in naruto-nx's console sessions (release/deko3d_variants.json, made by naruto-nx's
// tools/deko3d_variant_cache.py --emit-variants from the pipeline lists: shader names and constants, no game data):
// the stage's GLSL (the page's deko3d_glsl package) with "#define SPIRV_CROSS_CONSTANT_ID_<id> <value>u" lines after
// its first line, keyed by FNV-1a 64 of that text (plume_deko3d's loadVariant), compiled by uam built for the web
// (naruto-nx tools/wasm/uam_web.cpp: the console's own compiler, byte for byte). The file: "BDKC", version 1, the 16-byte
// compiler tag, then records (u64 key, u32 size, DKSH), keys ascending (banjo_renut_deko3d.cpp LoadCache).

const TAG = new TextEncoder().encode('uam110-sw8-bnx4\0');
const FNV_OFFSET = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const MASK = 0xffffffffffffffffn;

export function fnv1a64(bytes) {
  let h = FNV_OFFSET;
  for (let i = 0; i < bytes.length; i++) {
    h ^= BigInt(bytes[i]);
    h = (h * FNV_PRIME) & MASK;
  }
  return h;
}

function variantText(glsl, defines) {
  if (!defines) return glsl;
  const nl = glsl.indexOf('\n');
  return nl < 0 ? glsl : glsl.slice(0, nl + 1) + defines + glsl.slice(nl + 1);
}

// shaders: Map name -> GLSL text; variants: [[name, stage, defines, keyHex]]; uam: the uam_web module.
// Returns Uint8Array (the cache) and the count of variants whose key did not match (GLSL other than the tested one).
export function buildDkshCache(shaders, variants, uam, log = () => {}, progress = () => {}) {
  const enc = new TextEncoder();
  const records = [];
  let mismatched = 0;
  let failed = 0;
  variants.forEach(([name, stage, defines, keyHex], i) => {
    const glsl = shaders.get(name);
    if (glsl === undefined) {
      failed++;
      return;
    }
    const text = enc.encode(variantText(glsl, defines));
    const key = fnv1a64(text);
    if (key.toString(16).padStart(16, '0') !== keyHex) mismatched++;
    uam.FS.writeFile('/v.glsl', text);
    const rc = uam.ccall('uam_compile', 'number', ['number', 'string', 'string'], [stage === 'vert' ? 1 : 0, '/v.glsl', '/v.dksh']);
    if (rc !== 0) {
      failed++;
      return;
    }
    records.push([key, uam.FS.readFile('/v.dksh')]);
    if ((i + 1) % 100 === 0) progress((i + 1) / variants.length);
  });
  records.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const size = 24 + records.reduce((s, [, d]) => s + 12 + d.length, 0);
  const out = new Uint8Array(size);
  const view = new DataView(out.buffer);
  out.set(enc.encode('BDKC'), 0);
  view.setUint32(4, 1, true);
  out.set(TAG, 8);
  let at = 24;
  for (const [key, dksh] of records) {
    view.setBigUint64(at, key, true);
    view.setUint32(at + 8, dksh.length, true);
    out.set(dksh, at + 12);
    at += 12 + dksh.length;
  }
  log(`deko3d: ${records.length} shader variants compiled for the console (${failed} failed)`);
  return { cache: out, mismatched, failed };
}
