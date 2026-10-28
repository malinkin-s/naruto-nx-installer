// naruto-nx installer page: the player's extracted disc in, the SD card folder out (naruto-nx_<version>.zip). Every
// step runs in the browser (naruto_worker.js); the game files never leave the computer.
const T = {
  en: {
    kicker: 'NINTENDO SWITCH · INSTALLER', subtitle: 'naruto-nx: the shaders made from your own copy of the game',
    whatTitle: 'What this page does',
    what: 'It reads your extracted disc of Naruto: Rise of a Ninja (Xbox 360), translates the game\'s shaders for the Switch and compiles them for its GPU, so the game does not stutter compiling them, and gives you a zip with the program and those shaders. Everything happens in your browser: your game files are not uploaded anywhere.',
    step1: '1. Choose two files of your disc', step1Text: 'From your extracted disc (extract-xiso -x Naruto.iso), choose default.xex and xeshader.sdb, one file each. Only these two are read, in your browser; nothing is uploaded.',
    step2: '2. Make the package', create: 'Create naruto-nx.zip',
    step3: '3. Put it on the SD card',
    steps: ['Extract the zip to the root of your SD card: you get <code>switch/naruto-nx/</code>.',
      'Copy <strong>every file of your disc</strong> into <code>switch/naruto-nx/game/</code> (so that <code>switch/naruto-nx/game/default.xex</code> exists).',
      'Recommended: make a HOME Menu forwarder for <code>naruto.nro</code> in <a href="https://github.com/ITotalJustice/sphaira">Sphaira</a> with <strong>CPU cores = 4</strong> and <strong>address space = 39-bit</strong>, and start the game from its HOME Menu icon (the fourth core gives smoother play and cleaner sound).',
      'Or start the Homebrew Menu by holding <strong>R</strong> while starting any game (title override: full memory, three cores), then <strong>Naruto: Rise of a Ninja</strong>.'],
    checking: 'Checking…', noXex: 'Choose default.xex.', noSdb: 'Now choose xeshader.sdb.',
    unsupported: 'This default.xex is not the version the port was made for (SHA-256 {hash}).',
    supported: 'Your disc is supported: version {version}.',
    loading: 'Loading the translators…', translating: 'Translating {count} shaders (a few minutes)…',
    compiling: 'Compiling them for the Switch GPU…', downloading: 'Downloading the program…',
    done: 'Done: naruto-nx_{version}.zip.', failed: 'Failed: {message}',
    footer: 'naruto-nx installer, GPL-3.0, a fork of <a href="https://github.com/ChanseyIsTheBest/sa2-nx-installer">sa2-nx-installer</a>. Port: <a href="https://github.com/malinkin-s/naruto-rise-of-a-ninja-nx">naruto-rise-of-a-ninja-nx</a>. Fan project, not affiliated with Ubisoft, Bandai Namco, Microsoft or Nintendo.',
  },
  ru: {
    kicker: 'NINTENDO SWITCH · УСТАНОВЩИК', subtitle: 'naruto-nx: шейдеры из вашей собственной копии игры',
    whatTitle: 'Что делает эта страница',
    what: 'Она читает ваш распакованный диск Naruto: Rise of a Ninja (Xbox 360), переводит шейдеры игры для Switch и сразу компилирует их под её GPU, чтобы игра не статтерила на компиляции, и отдаёт zip с программой и этими шейдерами. Всё происходит в вашем браузере: файлы игры никуда не загружаются.',
    step1: '1. Выберите два файла диска', step1Text: 'Из распакованного диска (extract-xiso -x Naruto.iso) выберите default.xex и xeshader.sdb, каждый своей кнопкой. Читаются только эти два файла и только в вашем браузере; ничего не загружается.',
    step2: '2. Соберите пакет', create: 'Создать naruto-nx.zip',
    step3: '3. Скопируйте на SD-карту',
    steps: ['Распакуйте zip в корень SD-карты: появится <code>switch/naruto-nx/</code>.',
      'Скопируйте <strong>все файлы диска</strong> в <code>switch/naruto-nx/game/</code> (чтобы был путь <code>switch/naruto-nx/game/default.xex</code>).',
      'Рекомендуется: сделайте форвардер в HOME-меню для <code>naruto.nro</code> в <a href="https://github.com/ITotalJustice/sphaira">Sphaira</a> с параметрами <strong>CPU cores = 4</strong> и <strong>address space = 39-bit</strong> и запускайте игру значком из HOME-меню (четвёртое ядро даёт плавнее игру и чище звук).',
      'Или запустите Homebrew Menu, удерживая <strong>R</strong> при запуске любой игры (title override: полная память, три ядра), и выберите <strong>Naruto: Rise of a Ninja</strong>.'],
    checking: 'Проверка…', noXex: 'Выберите default.xex.', noSdb: 'Теперь выберите xeshader.sdb.',
    unsupported: 'Этот default.xex — не та версия, под которую сделан порт (SHA-256 {hash}).',
    supported: 'Ваш диск поддерживается: версия {version}.',
    loading: 'Загрузка переводчиков…', translating: 'Перевод {count} шейдеров (несколько минут)…',
    compiling: 'Компиляция под GPU Switch…', downloading: 'Загрузка программы…',
    done: 'Готово: naruto-nx_{version}.zip.', failed: 'Ошибка: {message}',
    footer: 'Установщик naruto-nx, GPL-3.0, ответвление <a href="https://github.com/ChanseyIsTheBest/sa2-nx-installer">sa2-nx-installer</a>. Порт: <a href="https://github.com/malinkin-s/naruto-rise-of-a-ninja-nx">naruto-rise-of-a-ninja-nx</a>. Фанатский проект, не связан с Ubisoft, Bandai Namco, Microsoft и Nintendo.',
  },
};
let lang = (localStorage.getItem('naruto-nx.lang') || (navigator.language || 'en')).startsWith('ru') ? 'ru' : 'en';
const t = (key, args = {}) => (T[lang][key] || key).replace(/\{(\w+)\}/g, (_, k) => args[k] ?? '');
const $ = (id) => document.getElementById(id);
const manifest = fetch('./release/manifest.json', { cache: 'no-cache' }).then((r) => r.json());
let chosen = null;  // { xex, sdb, build }
let statusKey = null;

function render() {
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
  for (const el of document.querySelectorAll('[data-t-html]')) el.innerHTML = t(el.dataset.tHtml);
  $('steps').innerHTML = T[lang].steps.map((s) => `<li>${s}</li>`).join('');
  for (const b of document.querySelectorAll('.langs button')) b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  if (statusKey) setStatus(...statusKey);
}
function setStatus(key, args = {}, cls = '') {
  statusKey = [key, args, cls];
  $('status').textContent = t(key, args);
  $('status').className = 'status ' + cls;
}
function log(key, args) {
  const div = document.createElement('div');
  div.textContent = t(key, args);
  $('log').appendChild(div);
}
async function sha256(bytes) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

for (const b of document.querySelectorAll('.langs button')) {
  b.onclick = () => { lang = b.dataset.lang; try { localStorage.setItem('naruto-nx.lang', lang); } catch {} render(); };
}

async function onPick() {
  chosen = null;
  $('create').disabled = true;
  const xexFile = $('xexInput').files[0];
  const sdbFile = $('sdbInput').files[0];
  if (!xexFile) return setStatus('noXex', {}, '');
  if (!sdbFile) return setStatus('noSdb', {}, '');
  setStatus('checking');
  const xex = new Uint8Array(await xexFile.arrayBuffer());
  const hash = await sha256(xex);
  const build = (await manifest).builds.find((b) => b.xex_sha256 === hash);
  if (!build) return setStatus('unsupported', { hash }, 'bad');
  chosen = { xex, sdb: new Uint8Array(await sdbFile.arrayBuffer()), build };
  setStatus('supported', { version: build.version }, 'good');
  $('create').disabled = false;
}
$('xexInput').onchange = onPick;
$('sdbInput').onchange = onPick;

$('create').onclick = () => {
  if (!chosen) return;
  $('create').disabled = true;
  $('log').textContent = '';
  const worker = new Worker('./naruto_worker.js?v=4', { type: 'module' });
  worker.onmessage = ({ data }) => {
    if (data.type === 'log') log(data.key, data.args);
    else if (data.type === 'progress') $('bar').style.width = `${Math.round(data.fraction * 100)}%`;
    else if (data.type === 'done') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(data.zip);
      a.download = `naruto-nx_${data.version}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      log('done', { version: data.version });
      worker.terminate();
      $('create').disabled = false;
    } else if (data.type === 'error') {
      log('failed', { message: data.message });
      worker.terminate();
      $('create').disabled = false;
    }
  };
  worker.postMessage({ xex: chosen.xex, sdb: chosen.sdb, build: chosen.build });
};
render();
