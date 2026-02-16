// World.js — The shared world in which Dots exist
//
// A World is shared amongst a set of Dots, each with their own
// view of its state and their own view of others.

import {
  WORLD_DEFAULT_WIDTH,
  WORLD_DEFAULT_HEIGHT,
  WORLD_DEFAULT_POLARITY,
  WORLD_DEFAULT_CHIRALITY,
} from '../config/defaults.js';

export default class World {
  constructor(data = {}) {
    this.type = 'DotWorld';

    // --- Identification ---
    this.name = data.name ?? `Lucagen-${Date.now()}`;

    // --- Dimensions ---
    this.width = data.width ?? WORLD_DEFAULT_WIDTH;
    this.height = data.height ?? WORLD_DEFAULT_HEIGHT;

    // --- World properties ---
    // polarity:  U | D (up or down)
    // chirality: L | R (left or right)
    this.polarity = data.polarity ?? WORLD_DEFAULT_POLARITY;
    this.chirality = data.chirality ?? WORLD_DEFAULT_CHIRALITY;

    // --- Vertices (wall boundaries) ---
    this.x1 = 0;
    this.x2 = this.width + 1;
    this.y1 = 0;
    this.y2 = this.height + 1;

    // --- Dot management ---
    this.dots = []; // ordered dot IDs
    this.dotRegistry = {}; // ID -> Dot instance
    this.freedomMode = true;

    // --- Spatial grid reference (set by WorldSimulation) ---
    this.spatialGrid = null;
  }

  addDot(dot) {
    const dotID = dot.id;
    if (dotID) {
      if (!this.dotRegistry[dotID]) this.dots.push(dotID);
      this.dotRegistry[dotID] = dot;
    }
  }

  removeDot(dotID) {
    const idx = this.dots.indexOf(dotID);
    if (idx !== -1) this.dots.splice(idx, 1);
    delete this.dotRegistry[dotID];
  }

  getDot(dotID) {
    return this.dotRegistry[dotID] ?? null;
  }

  getDotCount() {
    return this.dots.length;
  }

  forEachDot(callback) {
    for (const dotID of this.dots) {
      const dot = this.dotRegistry[dotID];
      if (dot) callback(dot);
    }
  }

  pauseDots() {
    this.forEachDot(dot => {
      if (!dot.isAsleep) dot.sleep();
    });
  }

  resumeDots() {
    this.forEachDot(dot => {
      if (dot.isAsleep) dot.wake();
    });
  }

  setFreedom(value) {
    this.freedomMode = value === true;
  }

  // Size world to viewport dimensions
  static fromViewport(options = {}) {
    return new World({
      ...options,
      width: options.width ?? window.innerWidth,
      height: options.height ?? window.innerHeight,
    });
  }
}
