// Builds sa2_shaders.mesp + sa2_shaders.mesp.idx, the shader library of the Switch build, from the player's own game
// files, entirely in the browser (or Node). The same steps as tools/build_shader_library.sh of sa2-nx: translate every
// container to HLSL (XenosRecomp), compile it to SPIR-V (DXC) and pack. The result must match, byte for byte, the
// library the NRO was tested with (its SHA-256 is in release/manifest.json).
//
// The containers are:
//  - the game's own shaders, the files of Shader/xbox360/obj (*.wpu pixel shaders, *.wvu vertex shaders);
//  - Direct3D's built-in shaders (clears, copies, the movie player...), which only exist as microcode inside
//    default.xex. They are put into containers exactly as the tested library has them: wrapped in a container made
//    from a template (shaders/tools/wrap_raw_shader.py of sa2-nx), or written over the microcode of a game container
//    of the same size (the clear shader, DumpMissingImmediate in app/src/me/me_native_system.cpp).
// Where the microcode is and which templates to use is part of the build's entry in the manifest ("shaders").

import { t } from './i18n.js';

function be32(data, offset) {
  return ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
}

function setBe32(data, offset, value) {
  data[offset] = value >>> 24;
  data[offset + 1] = (value >>> 16) & 0xff;
  data[offset + 2] = (value >>> 8) & 0xff;
  data[offset + 3] = value & 0xff;
}

async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isContainer(bytes) {
  return bytes.length >= 36 && (be32(bytes, 0) & 0xffffff00) >>> 0 === 0x102a1100;
}

// shaders/tools/wrap_raw_shader.py: raw microcode in a register-linked 2008 container. The template's virtual part is
// kept (its empty definitions), the shader header is rewritten to expose fetches, exports and interpolators by
// register, and the constant and definition tables are dropped.
export function wrapRawShader(raw, template, stage, depth = false) {
  if (!raw.length || raw.length % 4) {
    throw new Error('raw microcode must contain whole words');
  }
  if (!isContainer(template)) {
    throw new Error('the template is not a 2008 Xenos shader container');
  }
  const shader = be32(template, 24);
  const templateVirtual = be32(template, 4);
  if (shader + (stage === 'vs' ? 36 : 32) > templateVirtual) {
    throw new Error('the template shader header is truncated');
  }
  const virtualSize = stage === 'ps' ? Math.max(templateVirtual, shader + 32 + 16 * 4) : templateVirtual;
  const container = new Uint8Array(virtualSize + raw.length);
  container.set(template.subarray(0, Math.min(templateVirtual, template.length)), 0);
  setBe32(container, 4, virtualSize);
  setBe32(container, 8, raw.length);
  setBe32(container, shader, 0);
  setBe32(container, shader + 4, raw.length);
  setBe32(container, shader + 20, stage === 'ps' ? 16 << 5 : 0);
  setBe32(container, shader + 24, 0);
  if (stage === 'vs') {
    setBe32(container, shader + 28, 0);
    setBe32(container, shader + 32, 0);
  } else {
    setBe32(container, shader + 28, depth ? 0x11 : 0x01);
    for (let register = 0; register < 16; register++) {
      setBe32(container, shader + 32 + register * 4, register << 8);
    }
  }
  container.set(raw, virtualSize);
  setBe32(container, 16, 0); // constant table
  setBe32(container, 20, 0); // definition table
  return container;
}

// DumpMissingImmediate: a container whose microcode has the same size, with its microcode replaced.
export function replaceMicrocode(template, raw) {
  if (!isContainer(template)) {
    throw new Error('the template is not a 2008 Xenos shader container');
  }
  const container = template.slice();
  const virtualSize = be32(container, 4);
  const header = be32(container, 24);
  const offset = be32(container, header);
  const size = be32(container, header + 4);
  if (raw.length !== size || virtualSize + offset + size > container.length) {
    throw new Error('the microcode does not fit its template');
  }
  container.set(raw, virtualSize + offset);
  return container;
}

// The containers of the library: [{ name, stage, bytes }].
// gameShaders: Map of the lowercase file names of the shader folder to their bytes; image: default.xex decompressed.
export function shaderContainers(recipe, gameShaders, image) {
  const file = (name) => {
    const bytes = gameShaders.get(name.toLowerCase());
    if (!bytes) {
      throw new Error(t('shaderMissing', { name }));
    }
    return bytes;
  };
  const microcode = ({ offset, size }) => {
    if (offset + size > image.length) {
      throw new Error('a Direct3D shader is outside the executable');
    }
    return image.subarray(offset, offset + size);
  };
  const containers = [];
  const add = (stage, bytes) => containers.push({ name: `${stage}_${String(containers.length).padStart(3, '0')}.bin`, stage, bytes });
  for (const name of [...gameShaders.keys()].sort()) {
    const stage = name.endsWith('.wvu') ? 'vs' : 'ps';
    const bytes = gameShaders.get(name);
    if (!isContainer(bytes) || (bytes[3] & 1) !== (stage === 'vs' ? 1 : 0)) {
      throw new Error(t('shaderDamaged', { name }));
    }
    add(stage, bytes);
  }
  for (const wrap of recipe.wrap) {
    add(wrap.stage, wrapRawShader(microcode(wrap), file(recipe.templates[wrap.stage]), wrap.stage, Boolean(wrap.depth)));
  }
  for (const patch of recipe.patch) {
    add(patch.stage, replaceMicrocode(file(patch.template), microcode(patch)));
  }
  return containers;
}

// One fingerprint for a set of containers: the SHA-256 of their sorted SHA-256s, one per line. It tells early, before
// the long compilation, whether the containers are the tested ones.
export async function containersFingerprint(containers) {
  const hashes = [];
  for (const c of containers) {
    hashes.push(await sha256(c.bytes));
  }
  return sha256(new TextEncoder().encode(hashes.sort().join('\n')));
}

// containers: shaderContainers(); modules: { hlsl, dxc, pack } instantiated Emscripten modules (one object each);
// shaderCommon: shader_common.h of the translator. Returns { library, index } (the .mesp and its .idx).
export async function buildShaderLibrary(containers, modules, shaderCommon, log = () => {}) {
  const { hlsl, dxc, pack } = modules;

  hlsl.FS.mkdirTree('/in');
  for (const c of containers) {
    hlsl.FS.writeFile(`/in/${c.name}`, c.bytes);
  }
  hlsl.FS.writeFile('/shader_common.h', shaderCommon);
  const translated = hlsl.callMain(['/in', '/out', '/shader_common.h']);
  if (translated !== 0 && translated !== undefined) {
    throw new Error(`shader translation failed (${translated})`);
  }
  log(t('translatedShaders', { count: containers.length }));

  dxc.FS.mkdirTree('/work');
  pack.FS.mkdirTree('/in');
  pack.FS.mkdirTree('/spirv');
  let done = 0;
  for (const c of containers) {
    const stem = c.name.slice(0, -4);
    const input = `/work/${stem}.hlsl`;
    const output = `/work/${stem}.spv`;
    dxc.FS.writeFile(input, hlsl.FS.readFile(`/out/${stem}.hlsl`));
    const rc = dxc.ccall('compile', 'number', ['string', 'string', 'number'], [input, output, c.stage === 'vs' ? 1 : 0]);
    if (rc !== 0) {
      throw new Error(`DXC rejected ${stem} (${rc})`);
    }
    pack.FS.writeFile(`/spirv/${stem}.spv`, dxc.FS.readFile(output));
    pack.FS.writeFile(`/in/${c.name}`, c.bytes);
    dxc.FS.unlink(input);
    dxc.FS.unlink(output);
    if (++done % 10 === 0 || done === containers.length) {
      log(t('compiled', { done, total: containers.length }));
    }
  }
  const packed = pack.callMain(['/in', '/spirv', '/sa2_shaders.mesp']);
  if (packed !== 0 && packed !== undefined) {
    throw new Error(`packing failed (${packed})`);
  }
  return { library: pack.FS.readFile('/sa2_shaders.mesp'), index: pack.FS.readFile('/sa2_shaders.mesp.idx') };
}

