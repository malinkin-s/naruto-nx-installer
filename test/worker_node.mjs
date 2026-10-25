// naruto-nx: runs naruto_worker.js in Node as the page does (fetch of the page's files from disk, postMessage
// collected), with the two files of a disc. Usage: node test/worker_node.mjs <default.xex> <xeshader.sdb> [out.zip]
import fs from 'node:fs';
import path from 'node:path';
import { root } from './node_files.mjs';
const [xexPath, sdbPath, out] = process.argv.slice(2);
const realFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  const rel = String(url).replace(/^\.\//, '').replace(/\?.*$/, '');
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return realFetch(url);
  const bytes = fs.readFileSync(p);
  return new Response(bytes, { status: 200 });
};
let finished;
const done = new Promise((r) => { finished = r; });
globalThis.postMessage = (m) => {
  if (m.type === 'log') console.log('log', m.key, JSON.stringify(m.args));
  else if (m.type === 'error') { console.log('ERROR', m.message); finished(); }
  else if (m.type === 'done') { console.log('done', m.version, m.zip.size); if (out) m.zip.arrayBuffer().then((b) => { fs.writeFileSync(out, Buffer.from(b)); finished(); }); else finished(); }
};
await import('../naruto_worker.js');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release/manifest.json'), 'utf8'));
const xex = new Uint8Array(fs.readFileSync(xexPath));
globalThis.onmessage({ data: { xex, sdb: new Uint8Array(fs.readFileSync(sdbPath)), build: manifest.builds[0] } });
await done;
