// PixiApp.js — PixiJS v8 Application wrapper
//
// Manages canvas creation, resize handling, and stage access.

import { Application } from 'pixi.js';

export default class PixiApp {
  constructor() {
    this.app = new Application();
    this._initialized = false;
  }

  async init() {
    await this.app.init({
      resizeTo: window,
      background: 0x0a0a0a,
      antialias: true,
      preference: 'webgl',
    });

    document.body.appendChild(this.app.canvas);
    this._initialized = true;
    return this;
  }

  get stage() {
    return this.app.stage;
  }

  get screen() {
    return this.app.screen;
  }

  get canvas() {
    return this.app.canvas;
  }

  get renderer() {
    return this.app.renderer;
  }

  get initialized() {
    return this._initialized;
  }
}
