// SimulationLoop.js — Fixed-timestep game loop with render interpolation
//
// Simulation ticks at a fixed rate (default 10/sec).
// Rendering runs at display refresh rate (60fps) via requestAnimationFrame.
// The render callback receives an alpha value (0..1) for position interpolation.

import { TICK_INTERVAL } from '../config/defaults.js';

export default class SimulationLoop {
  constructor({ onTick, onRender, tickInterval = TICK_INTERVAL } = {}) {
    this.onTick = onTick;
    this.onRender = onRender;
    this.tickInterval = tickInterval;

    this._running = false;
    this._rafId = null;
    this._accumulator = 0;
    this._lastTime = 0;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    this._accumulator = 0;
    this._rafId = requestAnimationFrame(this._loop.bind(this));
  }

  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  stepOnce() {
    if (this._running) return;
    if (this.onTick) this.onTick();
    if (this.onRender) this.onRender(1);
  }

  setTickRate(ticksPerSecond) {
    this.tickInterval = 1000 / ticksPerSecond;
  }

  get isRunning() {
    return this._running;
  }

  _loop(timestamp) {
    if (!this._running) return;

    const dt = timestamp - this._lastTime;
    this._lastTime = timestamp;
    this._accumulator += dt;

    // Process simulation ticks (catch up if behind)
    while (this._accumulator >= this.tickInterval) {
      if (this.onTick) this.onTick();
      this._accumulator -= this.tickInterval;
    }

    // Render with interpolation alpha
    const alpha = this._accumulator / this.tickInterval;
    if (this.onRender) this.onRender(alpha);

    this._rafId = requestAnimationFrame(this._loop.bind(this));
  }
}
