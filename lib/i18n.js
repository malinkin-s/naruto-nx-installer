// Interface texts in the six languages of Sonic Adventure 2. Works in the page and in the worker (no DOM here).
// Static texts in index.html name their key with data-i18n (plain text) or data-i18n-html (text with markup).

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: 'uk' },
  { code: 'ja', name: '日本語', flag: 'japan' },
  { code: 'fr', name: 'Français', flag: 'france' },
  { code: 'de', name: 'Deutsch', flag: 'germany' },
  { code: 'es', name: 'Español', flag: 'spain' },
  { code: 'it', name: 'Italiano', flag: 'italy' },
];

const SPHAIRA = '<a href="https://github.com/NaGaa95/sphaira/releases" target="_blank" rel="noopener">Sphaira</a>';
const PACKAGE_PATH = '<code>Content/0000000000000000/58411202/000D0000/525E7BB1E72A2DB99AB79281BA24938048198FAD58</code>';
const DLC_PATH = '<code>58411202/00000002/SonicAdventure2Battle</code>';

const TEXTS = {
  en: {
    legal:
      'Sonic Adventure 2 and Sonic the Hedgehog are trademarks of SEGA. The icon artwork is © SEGA. sa2-nx is an unofficial fan project and is not affiliated with, endorsed or sponsored by SEGA, Nintendo or Microsoft. Nintendo Switch is a trademark of Nintendo; Xbox 360 and Xbox Live Arcade are trademarks of Microsoft. This site does not host or distribute game data or the original game executable: your package is read only inside your browser, is never uploaded, and its files are copied straight into the sa2-nx.zip saved on your computer. You need your own legally obtained copy of the game.',
    sourceCode: 'Source code',
    signature: 'a ChanseyIsTheBest project',
    lead:
      'Builds the <strong>Nintendo Switch</strong> package of <strong>Sonic Adventure 2</strong> from your own ' +
      '<strong>Xbox 360</strong> copy (Xbox Live Arcade). Everything runs in <strong>this browser</strong>.',
    languageBar: 'Language',
    step1: '1. Choose your game',
    formatPackage: 'Package file',
    formatFolder: 'Folder',
    ownCopy:
      '<strong>Important:</strong> you need your own copy of the game, copied from your own Xbox 360. The installer reads the game from it to make the package; without it, it cannot be made. Every game file in the package comes from your copy: the installer does not supply any of its own.',
    formatHint:
      `<strong>Package file:</strong> the game is ${PACKAGE_PATH} on the console. You can choose the <strong>Battle</strong> DLC (${DLC_PATH}) along with it. ` +
      '<strong>Folder:</strong> the <code>58411202</code> folder (the game and the DLC are found inside it), or a folder you extracted the game into (with <code>default.xex</code>).',
    nothingChosen: 'Nothing chosen yet.',
    chosenGame: 'Game: {name} ({size})',
    chosenDlc: 'DLC: {name} ({size})',
    chosenNoDlc: 'No DLC (optional)',
    step2: '2. Create the package',
    step2First: 'If you are installing the game for the first time, use:',
    create: 'Create sa2-nx.zip',
    step2Update:
      'If the game is already installed and you only want to update it (<code>sa2.nro</code> and the shaders, plus the DLC if you chose it), use:',
    createUpdate: 'Create sa2-nx-update.zip',
    step3: '3. Copy it to the Switch',
    step3Extract: 'Extract the downloaded zip into <code>sdmc:/switch/</code>.',
    step3Start:
      'Start <code>sa2.nro</code> from the Homebrew Menu in title takeover mode (<strong>launch</strong> a game installed on the Switch ' +
      `<strong>while holding R</strong>) or create a <strong>39-bit forwarder</strong> with ${SPHAIRA}. The album applet does not give the game enough memory.`,
    step3First:
      'The first time you play, new places can <strong>stutter</strong> for a moment while the graphics are prepared; they are kept on the SD card for the next sessions.',
    checking: 'Checking your game…',
    supported: 'Xbox Live Arcade · supported',
    supportedWithDlc: 'Xbox Live Arcade + Battle DLC · supported',
    unsupported: 'This version of the game is not supported yet.',
    notGame: 'Not the game',
    noGame: 'The game was not found: choose its package file, the 58411202 folder, or a folder with default.xex.',
    otherTitle: '{name} is not Sonic Adventure 2.',
    noStreaming: 'this browser window cannot stream downloads. Use a normal (not private) window.',
    downloadStarted: 'Download started ({size}). Keep this page open until it finishes.',
    finished: 'Finished in {seconds} s.',
    error: 'Error: {message}',
    cancelled: 'the download was cancelled',
    readingFiles: 'Reading your game',
    downloadingBuild: 'Downloading the Switch build',
    logBuild: 'Supported: Sonic Adventure 2 for Xbox Live Arcade (build {version})',
    logUpdate: 'Update package: sa2.nro and the shaders (and the DLC, if you chose it)',
    logDlc: 'DLC: {name}',
    foundShaders: 'Found {count} shaders; building the shader library',
    translatedShaders: 'Translated {count} shaders',
    compiled: 'Compiled {done} of {total}',
    libraryReady: 'Shader library ready: it matches the tested one',
    deko3dShaders: "Making the deko3d renderer's shaders from the game's {count}",
    deko3dReady: "deko3d shaders ready: they match the tested ones",
    checksumming: 'Checking the game files ({count} files)',
    gameIdentical: 'The game files are identical to the tested copy',
    gameDifferent: 'Warning: some game files differ from the tested copy (modified or damaged files?). The package is made anyway.',
    packing: 'Writing the package',
    done: 'Done: extract the zip into sdmc:/switch/',
    notSupportedYet: 'this version of the game is not supported yet. Executable fingerprint: {hash}',
    buildMismatch: 'the downloaded Switch build is not the published one ({hash}); try again later',
    libraryMismatch: 'the shader library does not match the tested one ({hash}); nothing was written',
    deko3dContainers: "the game's shaders were not all found ({found} of {wanted}); nothing was written",
    deko3dMismatch: "the deko3d shaders do not match the tested ones ({hash}); nothing was written",
    containersMismatch: 'the shaders of your game are not the tested ones; nothing was written',
    shaderMissing: 'the shader file {name} is missing from your game',
    shaderDamaged: 'the shader file {name} is damaged',
    incompleteGame: 'Incomplete game: {count} of {expected} files. Only the update package can be made.',
    incompleteError: 'the game is incomplete ({count} of {expected} files): choose the whole game',
    downloadFailed: 'could not download {url} ({status})',
  },
  ja: {
    legal:
      'Sonic Adventure 2 および Sonic the Hedgehog は SEGA の商標です。アイコンのアートワークは © SEGA です。sa2-nx は非公式のファンプロジェクトであり、SEGA、任天堂、Microsoft とは関係がなく、承認や支援も受けていません。Nintendo Switch は任天堂の商標です。Xbox 360 および Xbox Live Arcade は Microsoft の商標です。このサイトはゲームデータや元の実行ファイルをホストも配布もしません。あなたのパッケージはブラウザ内でのみ読み込まれ、アップロードされることはなく、そのファイルはお使いのコンピューターに保存される sa2-nx.zip に直接コピーされます。合法的に入手したご自身のゲームが必要です。',
    sourceCode: 'ソースコード',
    signature: 'ChanseyIsTheBest のプロジェクト',
    lead:
      'ご自身の <strong>Xbox 360</strong> 版（Xbox Live Arcade）から、<strong>Sonic Adventure 2</strong> の <strong>Nintendo Switch</strong> 用パッケージを作成します。すべての処理は<strong>このブラウザ内</strong>で行われます。',
    languageBar: '言語',
    step1: '1. ゲームを選ぶ',
    formatPackage: 'パッケージファイル',
    formatFolder: 'フォルダー',
    ownCopy:
      '<strong>重要：</strong>ご自身の Xbox 360 からコピーした、ご自身のゲームが必要です。インストーラーはそこからゲームを読み込んでパッケージを作成します。これがないと作成できません。パッケージ内のゲームファイルはすべてあなたのコピーから取得され、インストーラーはゲームファイルを一切提供しません。',
    formatHint:
      `<strong>パッケージファイル：</strong>本体では、ゲームは ${PACKAGE_PATH} にあります。<strong>Battle</strong> DLC（${DLC_PATH}）も一緒に選べます。` +
      '<strong>フォルダー：</strong><code>58411202</code> フォルダー（中のゲームと DLC が見つかります）、またはゲームを展開したフォルダー（<code>default.xex</code> を含むもの）。',
    nothingChosen: 'まだ何も選ばれていません。',
    chosenGame: 'ゲーム：{name}（{size}）',
    chosenDlc: 'DLC：{name}（{size}）',
    chosenNoDlc: 'DLC なし（任意）',
    step2: '2. パッケージを作成する',
    step2First: '初めてゲームをインストールする場合：',
    create: 'sa2-nx.zip を作成',
    step2Update: 'インストール済みで、更新（<code>sa2.nro</code> とシェーダー、選んだ場合は DLC も）だけを行う場合：',
    createUpdate: 'sa2-nx-update.zip を作成',
    step3: '3. Switch にコピーする',
    step3Extract: 'ダウンロードした zip を <code>sdmc:/switch/</code> に展開します。',
    step3Start:
      '<strong>タイトル乗っ取りモード</strong>の Homebrew Menu から <code>sa2.nro</code> を起動するか（Switch にインストールされたゲームを <strong>R を押しながら起動</strong>）、' +
      `${SPHAIRA} で <strong>39 ビットのフォワーダー</strong>を作成します。アルバムアプレットではゲームに必要なメモリが足りません。`,
    step3First:
      '初めてプレイするときは、グラフィックの準備のため、新しい場所で一瞬<strong>カクつく</strong>ことがあります。準備したデータは SD カードに保存され、次回からは使い回されます。',
    checking: 'ゲームを確認しています…',
    supported: 'Xbox Live Arcade · 対応',
    supportedWithDlc: 'Xbox Live Arcade + Battle DLC · 対応',
    unsupported: 'このバージョンのゲームにはまだ対応していません。',
    notGame: 'ゲームではありません',
    noGame: 'ゲームが見つかりません。パッケージファイル、58411202 フォルダー、または default.xex を含むフォルダーを選んでください。',
    otherTitle: '{name} は Sonic Adventure 2 ではありません。',
    noStreaming: 'このブラウザウィンドウではダウンロードをストリーミングできません。通常の（プライベートではない）ウィンドウを使ってください。',
    downloadStarted: 'ダウンロードを開始しました（{size}）。完了するまでこのページを開いたままにしてください。',
    finished: '{seconds} 秒で完了しました。',
    error: 'エラー：{message}',
    cancelled: 'ダウンロードがキャンセルされました',
    readingFiles: 'ゲームを読み込んでいます',
    downloadingBuild: 'Switch 版をダウンロードしています',
    logBuild: '対応：Xbox Live Arcade 版 Sonic Adventure 2（ビルド {version}）',
    logUpdate: '更新パッケージ：sa2.nro とシェーダー（選んだ場合は DLC も）',
    logDlc: 'DLC：{name}',
    foundShaders: '{count} 個のシェーダーが見つかりました。シェーダーライブラリを作成しています',
    translatedShaders: '{count} 個のシェーダーを変換しました',
    compiled: '{total} 個中 {done} 個をコンパイルしました',
    libraryReady: 'シェーダーライブラリの準備ができました（テスト済みのものと一致）',
    deko3dShaders: "ゲームの {count} 個のシェーダーから deko3d レンダラー用のシェーダーを作成しています",
    deko3dReady: "deko3d シェーダーの準備ができました（テスト済みのものと一致）",
    checksumming: 'ゲームファイルを確認しています（{count} ファイル）',
    gameIdentical: 'ゲームファイルはテスト済みのコピーと同一です',
    gameDifferent: '警告：一部のゲームファイルがテスト済みのコピーと異なります（改変または破損したファイル？）。パッケージはそのまま作成されます。',
    packing: 'パッケージを書き込んでいます',
    done: '完了：zip を sdmc:/switch/ に展開してください',
    notSupportedYet: 'このバージョンのゲームにはまだ対応していません。実行ファイルのフィンガープリント：{hash}',
    buildMismatch: 'ダウンロードした Switch 版が公開版と一致しません（{hash}）。しばらくしてからもう一度お試しください',
    libraryMismatch: 'シェーダーライブラリがテスト済みのものと一致しません（{hash}）。何も書き込まれていません',
    deko3dContainers: "ゲームのシェーダーがすべて見つかりませんでした（{wanted} 個中 {found} 個）。何も書き込まれていません",
    deko3dMismatch: "deko3d シェーダーがテスト済みのものと一致しません（{hash}）。何も書き込まれていません",
    containersMismatch: 'ゲームのシェーダーがテスト済みのものと異なります。何も書き込まれていません',
    shaderMissing: 'シェーダーファイル {name} がゲームにありません',
    shaderDamaged: 'シェーダーファイル {name} が破損しています',
    incompleteGame: 'ゲームが不完全です：{expected} ファイル中 {count} ファイル。更新パッケージのみ作成できます。',
    incompleteError: 'ゲームが不完全です（{expected} ファイル中 {count} ファイル）。ゲーム全体を選んでください',
    downloadFailed: '{url} をダウンロードできませんでした（{status}）',
  },
  fr: {
    legal:
      'Sonic Adventure 2 et Sonic the Hedgehog sont des marques de SEGA. L’illustration de l’icône est © SEGA. sa2-nx est un projet de fans non officiel, sans lien avec SEGA, Nintendo ou Microsoft, qui ne l’approuvent ni ne le parrainent. Nintendo Switch est une marque de Nintendo ; Xbox 360 et Xbox Live Arcade sont des marques de Microsoft. Ce site n’héberge ni ne distribue de données du jeu ni son exécutable original : votre package est lu uniquement dans votre navigateur, n’est jamais envoyé, et ses fichiers sont copiés directement dans le sa2-nx.zip enregistré sur votre ordinateur. Vous avez besoin de votre propre copie du jeu, obtenue légalement.',
    sourceCode: 'Code source',
    signature: 'un projet de ChanseyIsTheBest',
    lead:
      'Crée le package <strong>Nintendo Switch</strong> de <strong>Sonic Adventure 2</strong> à partir de votre propre copie ' +
      '<strong>Xbox 360</strong> (Xbox Live Arcade). Tout se passe dans <strong>ce navigateur</strong>.',
    languageBar: 'Langue',
    step1: '1. Choisissez votre jeu',
    formatPackage: 'Fichier du package',
    formatFolder: 'Dossier',
    ownCopy:
      '<strong>Important :</strong> il vous faut votre propre copie du jeu, copiée depuis votre propre Xbox 360. L’installateur y lit le jeu pour créer le package ; sans elle, il ne peut pas être créé. Tous les fichiers du jeu dans le package viennent de votre copie : l’installateur n’en fournit aucun.',
    formatHint:
      `<strong>Fichier du package :</strong> sur la console, le jeu est ${PACKAGE_PATH}. Vous pouvez choisir le DLC <strong>Battle</strong> (${DLC_PATH}) en même temps. ` +
      '<strong>Dossier :</strong> le dossier <code>58411202</code> (le jeu et le DLC y sont trouvés), ou un dossier dans lequel vous avez extrait le jeu (avec <code>default.xex</code>).',
    nothingChosen: 'Rien n’a encore été choisi.',
    chosenGame: 'Jeu : {name} ({size})',
    chosenDlc: 'DLC : {name} ({size})',
    chosenNoDlc: 'Pas de DLC (facultatif)',
    step2: '2. Créez le package',
    step2First: 'Si vous installez le jeu pour la première fois, utilisez :',
    create: 'Créer sa2-nx.zip',
    step2Update:
      'Si le jeu est déjà installé et que vous voulez seulement le mettre à jour (<code>sa2.nro</code> et les shaders, plus le DLC si vous l’avez choisi), utilisez :',
    createUpdate: 'Créer sa2-nx-update.zip',
    step3: '3. Copiez-le sur la Switch',
    step3Extract: 'Extrayez le zip téléchargé dans <code>sdmc:/switch/</code>.',
    step3Start:
      'Lancez <code>sa2.nro</code> depuis le Homebrew Menu en mode « title takeover » (<strong>lancez</strong> un jeu installé sur la Switch ' +
      `<strong>en maintenant R</strong>) ou créez un <strong>forwarder 39 bits</strong> avec ${SPHAIRA}. L’applet Album ne donne pas assez de mémoire au jeu.`,
    step3First:
      'La première fois que vous jouez, les nouveaux endroits peuvent <strong>saccader</strong> un instant pendant la préparation des graphismes ; elle est gardée sur la carte SD pour les sessions suivantes.',
    checking: 'Vérification de votre jeu…',
    supported: 'Xbox Live Arcade · pris en charge',
    supportedWithDlc: 'Xbox Live Arcade + DLC Battle · pris en charge',
    unsupported: 'Cette version du jeu n’est pas encore prise en charge.',
    notGame: 'Ce n’est pas le jeu',
    noGame: 'Le jeu est introuvable : choisissez son fichier de package, le dossier 58411202 ou un dossier contenant default.xex.',
    otherTitle: '{name} n’est pas Sonic Adventure 2.',
    noStreaming: 'cette fenêtre du navigateur ne peut pas diffuser de téléchargements. Utilisez une fenêtre normale (pas privée).',
    downloadStarted: 'Téléchargement lancé ({size}). Gardez cette page ouverte jusqu’à la fin.',
    finished: 'Terminé en {seconds} s.',
    error: 'Erreur : {message}',
    cancelled: 'le téléchargement a été annulé',
    readingFiles: 'Lecture de votre jeu',
    downloadingBuild: 'Téléchargement de la version Switch',
    logBuild: 'Pris en charge : Sonic Adventure 2 pour Xbox Live Arcade (version {version})',
    logUpdate: 'Package de mise à jour : sa2.nro et les shaders (et le DLC, si vous l’avez choisi)',
    logDlc: 'DLC : {name}',
    foundShaders: '{count} shaders trouvés ; création de la bibliothèque de shaders',
    translatedShaders: '{count} shaders traduits',
    compiled: '{done} sur {total} compilés',
    libraryReady: 'Bibliothèque de shaders prête : identique à celle qui a été testée',
    deko3dShaders: "Création des shaders du moteur deko3d à partir des {count} du jeu",
    deko3dReady: "Shaders deko3d prêts : identiques à ceux qui ont été testés",
    checksumming: 'Vérification des fichiers du jeu ({count} fichiers)',
    gameIdentical: 'Les fichiers du jeu sont identiques à la copie testée',
    gameDifferent: 'Attention : certains fichiers du jeu diffèrent de la copie testée (fichiers modifiés ou endommagés ?). Le package est quand même créé.',
    packing: 'Écriture du package',
    done: 'Terminé : extrayez le zip dans sdmc:/switch/',
    notSupportedYet: 'cette version du jeu n’est pas encore prise en charge. Empreinte de l’exécutable : {hash}',
    buildMismatch: 'la version Switch téléchargée n’est pas celle qui a été publiée ({hash}) ; réessayez plus tard',
    libraryMismatch: 'la bibliothèque de shaders ne correspond pas à celle qui a été testée ({hash}) ; rien n’a été écrit',
    deko3dContainers: "les shaders du jeu n’ont pas tous été trouvés ({found} sur {wanted}) ; rien n’a été écrit",
    deko3dMismatch: "les shaders deko3d ne correspondent pas à ceux qui ont été testés ({hash}) ; rien n’a été écrit",
    containersMismatch: 'les shaders de votre jeu ne sont pas ceux qui ont été testés ; rien n’a été écrit',
    shaderMissing: 'le fichier de shader {name} manque dans votre jeu',
    shaderDamaged: 'le fichier de shader {name} est endommagé',
    incompleteGame: 'Jeu incomplet : {count} sur {expected} fichiers. Seul le package de mise à jour peut être créé.',
    incompleteError: 'le jeu est incomplet ({count} sur {expected} fichiers) : choisissez le jeu entier',
    downloadFailed: 'impossible de télécharger {url} ({status})',
  },
  de: {
    legal:
      'Sonic Adventure 2 und Sonic the Hedgehog sind Marken von SEGA. Das Bild des Symbols ist © SEGA. sa2-nx ist ein inoffizielles Fanprojekt, steht in keiner Verbindung zu SEGA, Nintendo oder Microsoft und wird von ihnen weder unterstützt noch gefördert. Nintendo Switch ist eine Marke von Nintendo; Xbox 360 und Xbox Live Arcade sind Marken von Microsoft. Diese Seite stellt weder Spieldaten noch die ursprüngliche Programmdatei des Spiels bereit: Dein Paket wird nur in deinem Browser gelesen, niemals hochgeladen, und seine Dateien werden direkt in die sa2-nx.zip auf deinem Computer kopiert. Du brauchst deine eigene, legal erworbene Kopie des Spiels.',
    sourceCode: 'Quellcode',
    signature: 'ein Projekt von ChanseyIsTheBest',
    lead:
      'Erstellt das <strong>Nintendo Switch</strong>-Paket von <strong>Sonic Adventure 2</strong> aus deiner eigenen ' +
      '<strong>Xbox 360</strong>-Kopie (Xbox Live Arcade). Alles läuft in <strong>diesem Browser</strong>.',
    languageBar: 'Sprache',
    step1: '1. Wähle dein Spiel',
    formatPackage: 'Paketdatei',
    formatFolder: 'Ordner',
    ownCopy:
      '<strong>Wichtig:</strong> Du brauchst deine eigene Kopie des Spiels, kopiert von deiner eigenen Xbox 360. Der Installer liest das Spiel daraus, um das Paket zu erstellen; ohne sie geht es nicht. Alle Spieldateien im Paket stammen aus deiner Kopie: Der Installer liefert keine eigenen.',
    formatHint:
      `<strong>Paketdatei:</strong> Auf der Konsole ist das Spiel ${PACKAGE_PATH}. Du kannst den <strong>Battle</strong>-DLC (${DLC_PATH}) gleich mit auswählen. ` +
      '<strong>Ordner:</strong> der Ordner <code>58411202</code> (Spiel und DLC werden darin gefunden) oder ein Ordner, in den du das Spiel entpackt hast (mit <code>default.xex</code>).',
    nothingChosen: 'Noch nichts ausgewählt.',
    chosenGame: 'Spiel: {name} ({size})',
    chosenDlc: 'DLC: {name} ({size})',
    chosenNoDlc: 'Kein DLC (optional)',
    step2: '2. Paket erstellen',
    step2First: 'Wenn du das Spiel zum ersten Mal installierst:',
    create: 'sa2-nx.zip erstellen',
    step2Update: 'Wenn das Spiel schon installiert ist und du es nur aktualisieren willst (<code>sa2.nro</code> und die Shader, dazu der DLC, wenn du ihn ausgewählt hast):',
    createUpdate: 'sa2-nx-update.zip erstellen',
    step3: '3. Auf die Switch kopieren',
    step3Extract: 'Entpacke die heruntergeladene ZIP-Datei nach <code>sdmc:/switch/</code>.',
    step3Start:
      'Starte <code>sa2.nro</code> aus dem Homebrew-Menü im Title-Takeover-Modus (<strong>starte</strong> ein auf der Switch installiertes Spiel ' +
      `<strong>mit gedrückter R-Taste</strong>) oder erstelle mit ${SPHAIRA} einen <strong>39-Bit-Forwarder</strong>. Das Album-Applet gibt dem Spiel nicht genug Speicher.`,
    step3First:
      'Beim ersten Spielen können neue Orte kurz <strong>ruckeln</strong>, während die Grafik vorbereitet wird; sie bleibt für die nächsten Sitzungen auf der SD-Karte gespeichert.',
    checking: 'Dein Spiel wird geprüft …',
    supported: 'Xbox Live Arcade · unterstützt',
    supportedWithDlc: 'Xbox Live Arcade + Battle-DLC · unterstützt',
    unsupported: 'Diese Version des Spiels wird noch nicht unterstützt.',
    notGame: 'Nicht das Spiel',
    noGame: 'Das Spiel wurde nicht gefunden: Wähle seine Paketdatei, den Ordner 58411202 oder einen Ordner mit default.xex.',
    otherTitle: '{name} ist nicht Sonic Adventure 2.',
    noStreaming: 'Dieses Browserfenster kann keine Downloads streamen. Verwende ein normales (nicht privates) Fenster.',
    downloadStarted: 'Download gestartet ({size}). Lass diese Seite geöffnet, bis er fertig ist.',
    finished: 'Fertig in {seconds} s.',
    error: 'Fehler: {message}',
    cancelled: 'Der Download wurde abgebrochen',
    readingFiles: 'Dein Spiel wird gelesen',
    downloadingBuild: 'Die Switch-Version wird heruntergeladen',
    logBuild: 'Unterstützt: Sonic Adventure 2 für Xbox Live Arcade (Version {version})',
    logUpdate: 'Update-Paket: sa2.nro und die Shader (und der DLC, wenn du ihn ausgewählt hast)',
    logDlc: 'DLC: {name}',
    foundShaders: '{count} Shader gefunden; die Shader-Bibliothek wird erstellt',
    translatedShaders: '{count} Shader übersetzt',
    compiled: '{done} von {total} kompiliert',
    libraryReady: 'Shader-Bibliothek fertig: Sie stimmt mit der getesteten überein',
    deko3dShaders: "Die Shader des deko3d-Renderers werden aus den {count} des Spiels erstellt",
    deko3dReady: "deko3d-Shader fertig: Sie stimmen mit den getesteten überein",
    checksumming: 'Die Spieldateien werden geprüft ({count} Dateien)',
    gameIdentical: 'Die Spieldateien sind identisch mit der getesteten Kopie',
    gameDifferent: 'Achtung: Einige Spieldateien weichen von der getesteten Kopie ab (veränderte oder beschädigte Dateien?). Das Paket wird trotzdem erstellt.',
    packing: 'Das Paket wird geschrieben',
    done: 'Fertig: Entpacke die ZIP-Datei nach sdmc:/switch/',
    notSupportedYet: 'Diese Version des Spiels wird noch nicht unterstützt. Fingerabdruck der Programmdatei: {hash}',
    buildMismatch: 'Die heruntergeladene Switch-Version ist nicht die veröffentlichte ({hash}); versuche es später erneut',
    libraryMismatch: 'Die Shader-Bibliothek stimmt nicht mit der getesteten überein ({hash}); es wurde nichts geschrieben',
    deko3dContainers: "Nicht alle Shader des Spiels wurden gefunden ({found} von {wanted}); es wurde nichts geschrieben",
    deko3dMismatch: "Die deko3d-Shader stimmen nicht mit den getesteten überein ({hash}); es wurde nichts geschrieben",
    containersMismatch: 'Die Shader deines Spiels sind nicht die getesteten; es wurde nichts geschrieben',
    shaderMissing: 'Die Shader-Datei {name} fehlt in deinem Spiel',
    shaderDamaged: 'Die Shader-Datei {name} ist beschädigt',
    incompleteGame: 'Unvollständiges Spiel: {count} von {expected} Dateien. Nur das Update-Paket kann erstellt werden.',
    incompleteError: 'Das Spiel ist unvollständig ({count} von {expected} Dateien): Wähle das ganze Spiel',
    downloadFailed: '{url} konnte nicht heruntergeladen werden ({status})',
  },
  es: {
    legal:
      'Sonic Adventure 2 y Sonic the Hedgehog son marcas comerciales de SEGA. La ilustración del icono es © SEGA. sa2-nx es un proyecto no oficial de fans y no está afiliado, respaldado ni patrocinado por SEGA, Nintendo ni Microsoft. Nintendo Switch es una marca comercial de Nintendo; Xbox 360 y Xbox Live Arcade son marcas comerciales de Microsoft. Este sitio no aloja ni distribuye datos del juego ni su ejecutable original: tu paquete se lee solo dentro de tu navegador, nunca se sube, y sus archivos se copian directamente al sa2-nx.zip guardado en tu ordenador. Necesitas tu propia copia del juego, obtenida legalmente.',
    sourceCode: 'Código fuente',
    signature: 'un proyecto de ChanseyIsTheBest',
    lead:
      'Crea el paquete de <strong>Nintendo Switch</strong> de <strong>Sonic Adventure 2</strong> a partir de tu propia copia de ' +
      '<strong>Xbox 360</strong> (Xbox Live Arcade). Todo se hace en <strong>este navegador</strong>.',
    languageBar: 'Idioma',
    step1: '1. Elige tu juego',
    formatPackage: 'Archivo del paquete',
    formatFolder: 'Carpeta',
    ownCopy:
      '<strong>Importante:</strong> necesitas tu propia copia del juego, copiada desde tu propia Xbox 360. El instalador lee el juego de ella para crear el paquete; sin ella no se puede crear. Todos los archivos del juego que hay en el paquete vienen de tu copia: el instalador no aporta ninguno propio.',
    formatHint:
      `<strong>Archivo del paquete:</strong> en la consola, el juego es ${PACKAGE_PATH}. Puedes elegir también el DLC <strong>Battle</strong> (${DLC_PATH}). ` +
      '<strong>Carpeta:</strong> la carpeta <code>58411202</code> (dentro se encuentran el juego y el DLC), o una carpeta donde extrajiste el juego (con <code>default.xex</code>).',
    nothingChosen: 'Todavía no has elegido nada.',
    chosenGame: 'Juego: {name} ({size})',
    chosenDlc: 'DLC: {name} ({size})',
    chosenNoDlc: 'Sin DLC (opcional)',
    step2: '2. Crea el paquete',
    step2First: 'Si instalas el juego por primera vez, usa:',
    create: 'Crear sa2-nx.zip',
    step2Update: 'Si el juego ya está instalado y solo quieres actualizarlo (<code>sa2.nro</code> y los shaders, y el DLC si lo elegiste), usa:',
    createUpdate: 'Crear sa2-nx-update.zip',
    step3: '3. Cópialo a la Switch',
    step3Extract: 'Extrae el zip descargado en <code>sdmc:/switch/</code>.',
    step3Start:
      'Inicia <code>sa2.nro</code> desde el Homebrew Menu en modo title takeover (<strong>abre</strong> un juego instalado en la Switch ' +
      `<strong>manteniendo pulsado R</strong>) o crea un <strong>forwarder de 39 bits</strong> con ${SPHAIRA}. El applet del Álbum no da suficiente memoria al juego.`,
    step3First:
      'La primera vez que juegues, los lugares nuevos pueden dar <strong>tirones</strong> un momento mientras se preparan los gráficos; se guardan en la tarjeta SD para las siguientes sesiones.',
    checking: 'Comprobando tu juego…',
    supported: 'Xbox Live Arcade · compatible',
    supportedWithDlc: 'Xbox Live Arcade + DLC Battle · compatible',
    unsupported: 'Esta versión del juego aún no es compatible.',
    notGame: 'No es el juego',
    noGame: 'No se encontró el juego: elige su archivo de paquete, la carpeta 58411202 o una carpeta con default.xex.',
    otherTitle: '{name} no es Sonic Adventure 2.',
    noStreaming: 'esta ventana del navegador no puede transmitir descargas. Usa una ventana normal (no privada).',
    downloadStarted: 'Descarga iniciada ({size}). Mantén esta página abierta hasta que termine.',
    finished: 'Terminado en {seconds} s.',
    error: 'Error: {message}',
    cancelled: 'se canceló la descarga',
    readingFiles: 'Leyendo tu juego',
    downloadingBuild: 'Descargando la versión de Switch',
    logBuild: 'Compatible: Sonic Adventure 2 para Xbox Live Arcade (versión {version})',
    logUpdate: 'Paquete de actualización: sa2.nro y los shaders (y el DLC, si lo elegiste)',
    logDlc: 'DLC: {name}',
    foundShaders: 'Se encontraron {count} shaders; creando la biblioteca de shaders',
    translatedShaders: '{count} shaders traducidos',
    compiled: '{done} de {total} compilados',
    libraryReady: 'Biblioteca de shaders lista: coincide con la probada',
    deko3dShaders: "Creando los shaders del renderizador deko3d a partir de los {count} del juego",
    deko3dReady: "Shaders de deko3d listos: coinciden con los probados",
    checksumming: 'Comprobando los archivos del juego ({count} archivos)',
    gameIdentical: 'Los archivos del juego son idénticos a la copia probada',
    gameDifferent: 'Aviso: algunos archivos del juego no coinciden con la copia probada (¿archivos modificados o dañados?). El paquete se crea de todos modos.',
    packing: 'Escribiendo el paquete',
    done: 'Listo: extrae el zip en sdmc:/switch/',
    notSupportedYet: 'esta versión del juego aún no es compatible. Huella del ejecutable: {hash}',
    buildMismatch: 'la versión de Switch descargada no es la publicada ({hash}); inténtalo más tarde',
    libraryMismatch: 'la biblioteca de shaders no coincide con la probada ({hash}); no se escribió nada',
    deko3dContainers: "no se encontraron todos los shaders del juego ({found} de {wanted}); no se escribió nada",
    deko3dMismatch: "los shaders de deko3d no coinciden con los probados ({hash}); no se escribió nada",
    containersMismatch: 'los shaders de tu juego no son los probados; no se escribió nada',
    shaderMissing: 'falta el archivo de shader {name} en tu juego',
    shaderDamaged: 'el archivo de shader {name} está dañado',
    incompleteGame: 'Juego incompleto: {count} de {expected} archivos. Solo se puede crear el paquete de actualización.',
    incompleteError: 'el juego está incompleto ({count} de {expected} archivos): elige el juego completo',
    downloadFailed: 'no se pudo descargar {url} ({status})',
  },
  it: {
    legal:
      'Sonic Adventure 2 e Sonic the Hedgehog sono marchi di SEGA. L’illustrazione dell’icona è © SEGA. sa2-nx è un progetto amatoriale non ufficiale e non è affiliato, approvato o sponsorizzato da SEGA, Nintendo o Microsoft. Nintendo Switch è un marchio di Nintendo; Xbox 360 e Xbox Live Arcade sono marchi di Microsoft. Questo sito non ospita né distribuisce dati di gioco o l’eseguibile originale: il tuo pacchetto viene letto solo nel tuo browser, non viene mai caricato e i suoi file vengono copiati direttamente nel sa2-nx.zip salvato sul tuo computer. Ti serve una tua copia del gioco ottenuta legalmente.',
    sourceCode: 'Codice sorgente',
    signature: 'un progetto di ChanseyIsTheBest',
    lead:
      'Crea il pacchetto per <strong>Nintendo Switch</strong> di <strong>Sonic Adventure 2</strong> dalla tua copia ' +
      '<strong>Xbox 360</strong> (Xbox Live Arcade). Tutto avviene in <strong>questo browser</strong>.',
    languageBar: 'Lingua',
    step1: '1. Scegli il tuo gioco',
    formatPackage: 'File del pacchetto',
    formatFolder: 'Cartella',
    ownCopy:
      '<strong>Importante:</strong> ti serve una tua copia del gioco, copiata dalla tua Xbox 360. L’installer legge il gioco da lì per creare il pacchetto; senza di essa non può crearlo. Tutti i file di gioco del pacchetto provengono dalla tua copia: l’installer non ne fornisce nessuno.',
    formatHint:
      `<strong>File del pacchetto:</strong> sulla console il gioco è ${PACKAGE_PATH}. Puoi scegliere anche il DLC <strong>Battle</strong> (${DLC_PATH}). ` +
      '<strong>Cartella:</strong> la cartella <code>58411202</code> (il gioco e il DLC vengono trovati al suo interno) oppure una cartella in cui hai estratto il gioco (con <code>default.xex</code>).',
    nothingChosen: 'Non hai ancora scelto nulla.',
    chosenGame: 'Gioco: {name} ({size})',
    chosenDlc: 'DLC: {name} ({size})',
    chosenNoDlc: 'Nessun DLC (facoltativo)',
    step2: '2. Crea il pacchetto',
    step2First: 'Se installi il gioco per la prima volta, usa:',
    create: 'Crea sa2-nx.zip',
    step2Update: 'Se il gioco è già installato e vuoi solo aggiornarlo (<code>sa2.nro</code> e gli shader, più il DLC se l’hai scelto), usa:',
    createUpdate: 'Crea sa2-nx-update.zip',
    step3: '3. Copialo sulla Switch',
    step3Extract: 'Estrai lo zip scaricato in <code>sdmc:/switch/</code>.',
    step3Start:
      'Avvia <code>sa2.nro</code> dall’Homebrew Menu in modalità title takeover (<strong>avvia</strong> un gioco installato sulla Switch ' +
      `<strong>tenendo premuto R</strong>) oppure crea un <strong>forwarder a 39 bit</strong> con ${SPHAIRA}. L’applet Album non dà abbastanza memoria al gioco.`,
    step3First:
      'La prima volta che giochi, i luoghi nuovi possono <strong>scattare</strong> per un attimo mentre la grafica viene preparata; viene conservata sulla scheda SD per le sessioni successive.',
    checking: 'Controllo del gioco in corso…',
    supported: 'Xbox Live Arcade · supportato',
    supportedWithDlc: 'Xbox Live Arcade + DLC Battle · supportato',
    unsupported: 'Questa versione del gioco non è ancora supportata.',
    notGame: 'Non è il gioco',
    noGame: 'Gioco non trovato: scegli il suo file del pacchetto, la cartella 58411202 o una cartella con default.xex.',
    otherTitle: '{name} non è Sonic Adventure 2.',
    noStreaming: 'questa finestra del browser non può trasmettere i download. Usa una finestra normale (non privata).',
    downloadStarted: 'Download avviato ({size}). Tieni aperta questa pagina finché non termina.',
    finished: 'Completato in {seconds} s.',
    error: 'Errore: {message}',
    cancelled: 'il download è stato annullato',
    readingFiles: 'Lettura del gioco',
    downloadingBuild: 'Download della versione per Switch',
    logBuild: 'Supportato: Sonic Adventure 2 per Xbox Live Arcade (versione {version})',
    logUpdate: 'Pacchetto di aggiornamento: sa2.nro e gli shader (e il DLC, se l’hai scelto)',
    logDlc: 'DLC: {name}',
    foundShaders: 'Trovati {count} shader; creazione della libreria degli shader',
    translatedShaders: '{count} shader tradotti',
    compiled: '{done} di {total} compilati',
    libraryReady: 'Libreria degli shader pronta: corrisponde a quella testata',
    deko3dShaders: "Creazione degli shader del renderer deko3d dai {count} del gioco",
    deko3dReady: "Shader deko3d pronti: corrispondono a quelli testati",
    checksumming: 'Controllo dei file del gioco ({count} file)',
    gameIdentical: 'I file del gioco sono identici alla copia testata',
    gameDifferent: 'Attenzione: alcuni file del gioco sono diversi dalla copia testata (file modificati o danneggiati?). Il pacchetto viene creato comunque.',
    packing: 'Scrittura del pacchetto',
    done: 'Fatto: estrai lo zip in sdmc:/switch/',
    notSupportedYet: 'questa versione del gioco non è ancora supportata. Impronta dell’eseguibile: {hash}',
    buildMismatch: 'la versione per Switch scaricata non è quella pubblicata ({hash}); riprova più tardi',
    libraryMismatch: 'la libreria degli shader non corrisponde a quella testata ({hash}); non è stato scritto nulla',
    deko3dContainers: "non tutti gli shader del gioco sono stati trovati ({found} di {wanted}); non è stato scritto nulla",
    deko3dMismatch: "gli shader deko3d non corrispondono a quelli testati ({hash}); non è stato scritto nulla",
    containersMismatch: 'gli shader del tuo gioco non sono quelli testati; non è stato scritto nulla',
    shaderMissing: 'nel tuo gioco manca il file shader {name}',
    shaderDamaged: 'il file shader {name} è danneggiato',
    incompleteGame: 'Gioco incompleto: {count} file su {expected}. Si può creare solo il pacchetto di aggiornamento.',
    incompleteError: 'il gioco è incompleto ({count} file su {expected}): scegli il gioco completo',
    downloadFailed: 'impossibile scaricare {url} ({status})',
  },
};

let current = 'en';

export function getLanguage() {
  return current;
}

export function setLanguage(code) {
  current = TEXTS[code] ? code : 'en';
  return current;
}

// The visitor's choice (saved in their browser), else the browser's language when it is one of ours, else English.
export function preferredLanguage(saved, browser = []) {
  if (saved && TEXTS[saved]) {
    return saved;
  }
  for (const tag of browser) {
    const code = String(tag).toLowerCase().split('-')[0];
    if (TEXTS[code]) {
      return code;
    }
  }
  return 'en';
}

export function t(key, params = {}) {
  const text = TEXTS[current][key] ?? TEXTS.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (params[name] ?? `{${name}}`));
}

// Sizes as Windows Explorer shows them, so the page and the file's properties agree: units of 1024 bytes (which
// Windows calls KB, MB and GB) and three significant digits, truncated. 7,834,892,288 bytes is 7.29 GB, not 7.83.
const SIZE_UNITS = { fr: ['Ko', 'Mo', 'Go'] };

export function formatSize(bytes) {
  const units = SIZE_UNITS[current] ?? ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  const scale = 10 ** decimals;
  // The small epsilon keeps values such as 7.3 from becoming 7.29 through floating point.
  const shown = Math.floor(value * scale + 1e-9) / scale;
  const number = new Intl.NumberFormat(current, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${number.format(shown)} ${units[unit]}`;
}
