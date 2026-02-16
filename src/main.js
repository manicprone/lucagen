// lucagen v2 — entry point
// Phase 0: blank PixiJS canvas shell
// Phase 1+: simulation wired here

import { Application } from 'pixi.js';

const app = new Application();

async function init() {
  await app.init({
    resizeTo: window,
    background: 0x0a0a0a,
    antialias: true,
  });

  document.body.appendChild(app.canvas);
  console.log('lucagen v2 — canvas ready');
}

init();
