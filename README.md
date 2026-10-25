<h1 align=center>naruto-nx installer</h1>

The installer page of [naruto-nx](https://github.com/malinkin-s/naruto-rise-of-a-ninja-nx), the Nintendo Switch port
of Naruto: Rise of a Ninja: **https://malinkin-s.github.io/naruto-nx-installer/**

You give it your own extracted Xbox 360 disc (the folder with `default.xex` and `xeshader.sdb`), and it gives you a
zip to extract to the root of the SD card. Everything runs in your browser: the game files never leave your computer.
Then copy your disc's files into `switch/naruto-nx/game/`.

Установщик порта: выберите папку распакованного диска (с `default.xex` и `xeshader.sdb`), страница сделает zip для
SD-карты. Всё происходит в браузере, файлы игры никуда не загружаются.

## What it does

1. Identifies the disc by the SHA-256 of `default.xex` and picks its build in `release/manifest.json`.
2. Makes the game's shaders: the shader containers of the decompressed `default.xex` and of `xeshader.sdb`, translated
   by Renut's XenosRecomp (`wasm/renut_hlsl`), DXC (`wasm/dxc_web`), SPIRV-Cross (`wasm/spirv_cross`) and the deko3d
   passes (`lib/deko3d_glsl.js`), packed as `deko3d_glsl.bin` and checked against the build's SHA-256.
3. Compiles them for the Switch GPU in advance: every shader variant of `release/deko3d_variants.json` (the pipelines
   the game drew in naruto-nx's console sessions: shader names and constants, no game data) by uam built for the web
   (`wasm/uam_web`, naruto-nx's `tools/wasm/uam_web.cpp`: the console's compiler, byte for byte), as the console's cache
   `deko3d_shaders.bin`. The console then does not compile them while you play (stutters, a core at 100 %).
4. Downloads the NRO (the `naruto.nro` asset of the port's release, copied here by the deployment), checks its SHA-256
   and writes `switch/naruto-nx/{naruto.nro, LICENSES.txt, deko3d_glsl.bin, deko3d_shaders.bin}` into the zip.

## Tests (Node)

```
node test/naruto_deko3d_node.mjs <game folder> <naruto-nx out/deko3d_shaders/glsl_opt>
node test/naruto_manifest.mjs <game folder> <naruto.nro> <version> <glsl_opt> [--zip out.zip]   # the manifest entry
```

## Credits

A fork of [sa2-nx-installer](https://github.com/ChanseyIsTheBest/sa2-nx-installer) by ChanseyIsTheBest (GPL-3.0), with
peggle2-nx-installer's deko3d chain and nfsmw-nx-installer's WebAssembly DXC; see [NOTICES.md](NOTICES.md). Fan project,
not affiliated with Ubisoft, Bandai Namco, Microsoft or Nintendo.
