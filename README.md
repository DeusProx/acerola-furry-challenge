# Acerola Furry Challenge

[#AcerolaFurryChallenge](https://twitter.com/hashtag/acerolaFurryChallenge)

Prototype implementations of shell texturing with typescript and WebGPU.

## Requirements

In order to run these demo you need a browser with WebGPU support and explicitely enable it.
On Debian based system you can install `google-chrome-unstable` from the [Google Chrome PPA](https://www.ubuntuupdates.org/ppa/google_chrome?dist=stable).

Afterwards you need to open the newly installed browser and go to `chrome://flags`.
You need to enable
  [#enable-webgpu-developer-features](chrome://flags/#enable-webgpu-developer-features),
  [#enable-unsafe-webgpu](chrome://flags/#enable-unsafe-webgpu) &
  [#enable-vulkan](chrome://flags/#enable-vulkan).
Restart your browser.

After go to `chrome://gpu/`. WebGPU should state <span style="color: rgb(0, 255, 0);">Hardware accelerated</span>.

## Overview

Every subdirectory contains a different step

- [base](./base) - Setup canvas and draw a simple gradient with WebGPU
- [grass](./grass) - shell texturing

