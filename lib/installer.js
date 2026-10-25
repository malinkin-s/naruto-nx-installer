// Builds the sa2-nx.zip package from the player's own copy of the game.
//
// The game comes as its Xbox Live Arcade content package (an STFS volume, read in place) or as a folder it was
// extracted into. The zip holds the Switch build (sa2.nro) and its licenses, the game's shaders made from its own files
// (from 1.0.3 deko3d_glsl.bin, the deko3d renderer's GLSL; before it the native renderer's sa2_shaders.mesp), the game
// files as the asset pack the console mounts (game_root.nxpack + .nxidx) and, when chosen, the Battle DLC package
// (installed by the game from dlc/ at its first start). The settings file, sa2.toml, is written by
// the game at its first start, so an update never replaces the player's settings.

import { readXexImage } from './xex.js';
import { CONTENT_DLC, CONTENT_GAME, StfsPackage, readStfsHeader } from './stfs.js';
import { buildShaderLibrary, containersFingerprint, shaderContainers } from './shaders.js';
import { buildDeko3dPackage, sa2Containers } from './deko3d.js';
import { Fnv64, packChunks, packIndex, planPack } from './nxpack.js';
import { ZipWriter, zipSize } from './zip.js';
import { t } from './i18n.js';

const CHUNK = 16 * 1024 * 1024;
const ROOT = 'sa2-nx';
const TITLE_ID = 0x58411202;
// files whose header is read to find the packages in a chosen folder (packages have no extension)
const MAX_CANDIDATES = 256;

async function sha256(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function* chunksOf(file) {
  for (let offset = 0; offset < file.size; offset += CHUNK) {
    yield await file.read(offset, Math.min(CHUNK, file.size - offset));
  }
}

function baseName(path) {
  return path.slice(path.lastIndexOf('/') + 1);
}

// The LZX step of readXexImage, done by libmspack compiled to WebAssembly.
export function lzxStep(lzx) {
  return async (compressed, bits, size) => {
    lzx.FS.writeFile('/image.lzx', compressed);
    const rc = lzx.callMain(['/image.lzx', '/image.bin', String(bits), String(size)]);
    if (rc) {
      throw new Error(`LZX decompression failed (${rc})`);
    }
    const out = lzx.FS.readFile('/image.bin');
    lzx.FS.unlink('/image.lzx');
    lzx.FS.unlink('/image.bin');
    return out;
  };
}

// Where the program is downloaded from. Its SHA-256 is part of the address, so every version is a different address
// and a copy kept by the browser is never mistaken for a newer one.
export function programPath(build) {
  return `./release/${build.nro}?sha256=${build.nro_sha256}`;
}

// Sorts out what the player chose: files ([{ path, size, read }]) from the "Package file" button (the chosen files) or
// from the "Folder" button (every file under the folder, path relative to it).
// Returns { game, dlc, others }: game = { kind: 'package' | 'folder', name, size, files } or null; dlc = the Battle
// DLC packages ([{ name, size, read }]); others = the names of content packages of other games.
export async function findGame(chosen) {
  // An extracted game: the shallowest default.xex names its folder, and every file in that folder is a game file. The
  // game itself has a content package among its files (AvatarAwards, title 58411202, content type 2, like the DLC),
  // so packages are only looked for outside that folder.
  const executables = chosen
    .filter((f) => baseName(f.path).toLowerCase() === 'default.xex')
    .sort((a, b) => a.path.split('/').length - b.path.split('/').length);
  let game = null;
  let rest = chosen;
  if (executables.length) {
    const prefix = executables[0].path.slice(0, -'default.xex'.length);
    const files = chosen
      .filter((f) => f.path.startsWith(prefix))
      .map((f) => ({ ...f, path: f.path.slice(prefix.length) }));
    game = {
      kind: 'folder',
      name: prefix ? baseName(prefix.slice(0, -1)) : '',
      size: files.reduce((sum, f) => sum + f.size, 0),
      files,
    };
    rest = chosen.filter((f) => !f.path.startsWith(prefix));
  }
  // content packages: the game (000D0000) and the DLC (00000002), told apart by their header
  const candidates = rest
    .filter((f) => f.size >= 0xa000 && !baseName(f.path).includes('.'))
    .sort((a, b) => Number(!a.path.includes('58411202')) - Number(!b.path.includes('58411202')))
    .slice(0, MAX_CANDIDATES);
  const dlc = [];
  const others = [];
  for (const file of candidates) {
    const header = readStfsHeader(await file.read(0, 0x600));
    if (!header) {
      continue;
    }
    const name = baseName(file.path);
    if (header.titleId !== TITLE_ID) {
      others.push(header.displayName || name);
    } else if (header.contentType === CONTENT_GAME && !game) {
      const pkg = await StfsPackage.open(file);
      game = { kind: 'package', name, size: file.size, files: pkg.files() };
    } else if (header.contentType === CONTENT_DLC && !dlc.some((d) => d.name === name)) {
      dlc.push({ name, size: file.size, read: file.read, path: file.path });
    }
  }
  return { game, dlc, others };
}

// Identifies the build of this game: by the SHA-256 of default.xex, or, for an executable another tool rebuilt
// (decrypted or decompressed), by the SHA-256 of its decompressed image.
// Returns { xex, xexHash, build (null when there is none) }.
export async function identifyGame(files, manifest, decompressLzx = null) {
  const xexFile = files.find((f) => f.path.toLowerCase() === 'default.xex');
  if (!xexFile) {
    const error = new Error(t('noGame'));
    error.code = 'noGame';
    throw error;
  }
  const xex = await xexFile.read(0, xexFile.size);
  const xexHash = await sha256(xex);
  let build = manifest.builds.find((b) => b.xex_sha256 === xexHash) || null;
  if (!build && decompressLzx) {
    try {
      const { image } = await readXexImage(xex, decompressLzx);
      const imageHash = await sha256(image);
      build = manifest.builds.find((b) => b.image_sha256 === imageHash) || null;
    } catch {
      // not a readable executable: unsupported
    }
  }
  return { xex, xexHash, build };
}

// The files of the shader folder (lowercase names -> bytes).
async function readShaderFolder(files, folder) {
  const prefix = folder.toLowerCase() + '/';
  const shaders = new Map();
  for (const f of files) {
    const path = f.path.toLowerCase();
    if (path.startsWith(prefix) && /\.(wpu|wvu)$/.test(path) && !path.slice(prefix.length).includes('/')) {
      shaders.set(path.slice(prefix.length), await f.read(0, f.size));
    }
  }
  return shaders;
}

// The shader library of a build, made from the game's files and checked against the tested one.
// Returns { library, index }.
export async function makeShaderLibrary(files, xex, build, modules, shaderCommon, log = () => {}) {
  const { image } = await readXexImage(xex, lzxStep(modules.lzx));
  const containers = shaderContainers(build.shaders, await readShaderFolder(files, build.shaders.folder), image);
  log(t('foundShaders', { count: containers.length }));
  if ((await containersFingerprint(containers)) !== build.shaders.containers_sha256) {
    throw new Error(t('containersMismatch'));
  }
  const { library, index } = await buildShaderLibrary(containers, modules, shaderCommon, log);
  const libraryHash = await sha256(library);
  if (libraryHash !== build.library_sha256 || (await sha256(index)) !== build.index_sha256) {
    throw new Error(t('libraryMismatch', { hash: libraryHash }));
  }
  log(t('libraryReady'));
  return { library, index };
}

// sa2-nx 1.0.3: the deko3d renderer's shaders: deko3d_glsl.bin, which the NRO reads beside itself, made from the shaders
// in default.xex and Shader/xbox360/obj (lib/deko3d.js) and checked against the build's manifest entry ("deko3d": {
// folder, passes, shaders, containers_sha256, package_sha256 }). null for a build without that entry.
// modules: { lzx, renutHlsl, dxc, spirvCross }; renutCommon: Renut's shader_common.h.
export async function makeDeko3dPackage(files, xex, build, modules, renutCommon, log = () => {}) {
  if (!build.deko3d) {
    return null;
  }
  const { image } = await readXexImage(xex, lzxStep(modules.lzx));
  const wanted = new Set(build.deko3d.containers_sha256);
  const containers = [];
  const found = new Set();
  for (const c of sa2Containers(image, await readShaderFolder(files, build.deko3d.folder))) {
    const hash = await sha256(c.bytes);
    if (wanted.has(hash) && !found.has(hash)) {
      found.add(hash);
      containers.push(c);
    }
  }
  if (found.size !== wanted.size) {
    throw new Error(t('deko3dContainers', { found: found.size, wanted: wanted.size }));
  }
  log(t('deko3dShaders', { count: build.deko3d.shaders.length }));
  const { package: pkg } = await buildDeko3dPackage(containers, build.deko3d.shaders, build.deko3d.passes, modules,
    renutCommon);
  const hash = await sha256(pkg);
  if (hash !== build.deko3d.package_sha256) {
    throw new Error(t('deko3dMismatch', { hash }));
  }
  log(t('deko3dReady'));
  return pkg;
}

// chosen: findGame(); release: { manifest, nro: Uint8Array, licenses: Uint8Array (release/LICENSES.txt),
// shaderCommon: Uint8Array, renutShaderCommon: Uint8Array (a build with "deko3d") }
// modules: { hlsl, dxc, pack, lzx } instantiated Emscripten modules (one object each), and { renutHlsl, spirvCross } for
// a build with "deko3d"
// sink: { write(Uint8Array), close() } receiving the zip file
// onSize(bytes) is called with the exact size of the zip before the first byte is written.
// update: only the program, its licenses and the shaders (and the DLC when chosen), for a folder already on the SD
// card.
export async function createPackage(chosen, release, modules, sink, log = () => {}, progress = () => {},
  onSize = () => {}, { update = false } = {}) {
  const { game, dlc } = chosen;
  if (!game) {
    throw new Error(t('noGame'));
  }
  const { xex, xexHash, build } = await identifyGame(game.files, release.manifest, lzxStep(modules.lzx));
  if (!build) {
    throw new Error(t('notSupportedYet', { hash: xexHash }));
  }
  log(t('logBuild', { version: build.version }));
  if (update) {
    log(t('logUpdate'));
  }
  for (const d of dlc) {
    log(t('logDlc', { name: d.name }));
  }

  // a folder the game was only partly extracted into would make a package that does not start
  if (!update && game.files.length < build.game_files) {
    throw new Error(t('incompleteError', { count: game.files.length, expected: build.game_files }));
  }

  // The shaders first: they are the step most likely to stop the package, and nothing is written before them. A build
  // has the native renderer's library ("shaders"), the deko3d renderer's package ("deko3d", 1.0.3 on), or both.
  const { library, index } = build.shaders
    ? await makeShaderLibrary(game.files, xex, build, modules, release.shaderCommon, log)
    : { library: null, index: null };
  const deko3d = await makeDeko3dPackage(game.files, xex, build, modules, release.renutShaderCommon, log);

  const gameBytes = update ? 0 : game.files.reduce((sum, f) => sum + f.size, 0);
  const dlcBytes = dlc.reduce((sum, d) => sum + d.size, 0);
  let plan = null;
  let packSize = 0;
  if (!update) {
    plan = planPack(game.files);
    packSize = plan.packSize;
  }
  const total = gameBytes + packSize + dlcBytes || 1;
  let done = 0;
  const onChunk = (chunk) => {
    done += chunk.length;
    progress(done / total);
  };

  // The pack header and its index carry the checksum of all the game data: a first reading of the files.
  let dataChecksum = 0n;
  let gameIndex = null;
  if (!update) {
    log(t('checksumming', { count: plan.items.length }));
    const fnv = new Fnv64();
    for (const item of plan.items) {
      for await (const chunk of chunksOf(item.file)) {
        fnv.update(chunk);
        onChunk(chunk);
      }
    }
    dataChecksum = fnv.value();
    const identical = plan.items.length === build.game_files && gameBytes === build.game_bytes &&
      dataChecksum.toString(16).padStart(16, '0') === build.game_data_fnv;
    log(t(identical ? 'gameIdentical' : 'gameDifferent'));
    gameIndex = packIndex(plan, dataChecksum);
  }

  const entries = [
    { path: `${ROOT}/sa2.nro`, size: release.nro.length },
    { path: `${ROOT}/LICENSES.txt`, size: release.licenses.length },
    ...(library ? [
      { path: `${ROOT}/sa2_shaders.mesp`, size: library.length },
      { path: `${ROOT}/sa2_shaders.mesp.idx`, size: index.length },
    ] : []),
    ...(deko3d ? [{ path: `${ROOT}/deko3d_glsl.bin`, size: deko3d.length }] : []),
    ...(update ? [] : [
      { path: `${ROOT}/game_root.nxidx`, size: gameIndex.length },
      { path: `${ROOT}/game_root.nxpack`, size: packSize },
    ]),
    ...dlc.map((d) => ({ path: `${ROOT}/dlc/${d.name}`, size: d.size })),
  ];
  onSize(zipSize(entries));
  log(t('packing'));
  const zip = new ZipWriter(sink);
  await zip.addBytes(`${ROOT}/sa2.nro`, release.nro);
  await zip.addBytes(`${ROOT}/LICENSES.txt`, release.licenses);
  if (library) {
    await zip.addBytes(`${ROOT}/sa2_shaders.mesp`, library);
    await zip.addBytes(`${ROOT}/sa2_shaders.mesp.idx`, index);
  }
  if (deko3d) {
    await zip.addBytes(`${ROOT}/deko3d_glsl.bin`, deko3d);
  }
  if (!update) {
    await zip.addBytes(`${ROOT}/game_root.nxidx`, gameIndex);
    await zip.addFile(`${ROOT}/game_root.nxpack`, packSize, packChunks(plan, dataChecksum, (item) => chunksOf(item.file)),
      onChunk);
  }
  for (const d of dlc) {
    await zip.addFile(`${ROOT}/dlc/${d.name}`, d.size, chunksOf(d), onChunk);
  }
  await zip.finish();
  progress(1);
  log(t('done'));
  return { version: build.version, dlc: dlc.length, update };
}
