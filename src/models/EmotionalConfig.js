// EmotionalConfig.js — Standalone emotional grid for a Dot
//
// 3x3 grid layout:
//   x  s  y     Row 0: Motivational stimulation
//   L  d  R     Row 1: Center row
//   o  n  g     Row 2: Situational awareness
//
// Columns: world (left) | self (center) | others (right)
//
// Four corner quadrants (bipolar scales):
//   x = Intrigue Drive:      agitation (-) ↔ anticipation (+)
//   y = Conformity Ratio:    independence (-) ↔ conformity (+)
//   o = Comfort Drive:       fear (-) ↔ safety (+)
//   g = Connectedness Ratio: isolation (-) ↔ inclusion (+)
//
// Center cross (s, L, d, R, n) = Pride Factor: shame (-) ↔ pride (+)
//
// Values range from -1 (unset) to 3 (max intensity).

import { EMOTION_UNSET, EMOTION_MAX } from '../config/defaults.js';

// Grid position constants
const GRID_POSITIONS = {
  x: { row: 0, col: 0 },
  s: { row: 0, col: 1 },
  y: { row: 0, col: 2 },
  L: { row: 1, col: 0 },
  d: { row: 1, col: 1 },
  R: { row: 1, col: 2 },
  o: { row: 2, col: 0 },
  n: { row: 2, col: 1 },
  g: { row: 2, col: 2 },
};

// Dimensional definitions
const CORNER_KEYS = ['x', 'y', 'o', 'g'];
const CROSS_KEYS = ['s', 'L', 'd', 'R', 'n'];
const ALL_KEYS = ['x', 's', 'y', 'L', 'd', 'R', 'o', 'n', 'g'];

const DIMENSIONS = {
  x: { name: 'Intrigue Drive', negative: 'agitation', positive: 'anticipation' },
  y: { name: 'Conformity Ratio', negative: 'independence', positive: 'conformity' },
  o: { name: 'Comfort Drive', negative: 'fear', positive: 'safety' },
  g: { name: 'Connectedness Ratio', negative: 'isolation', positive: 'inclusion' },
};

export default class EmotionalConfig {
  constructor(data = {}) {
    for (const key of ALL_KEYS) {
      this[key] = data[key] !== undefined ? data[key] : EMOTION_UNSET;
    }
  }

  // --- Accessors ---

  getCorners() {
    return { x: this.x, y: this.y, o: this.o, g: this.g };
  }

  getCross() {
    return { s: this.s, L: this.L, d: this.d, R: this.R, n: this.n };
  }

  getAll() {
    const result = {};
    for (const key of ALL_KEYS) {
      result[key] = this[key];
    }
    return result;
  }

  getValue(key) {
    return this[key];
  }

  setValue(key, value) {
    if (ALL_KEYS.includes(key)) {
      this[key] = value;
    }
  }

  // --- Bloom level ---
  // Returns 0..1 representing how "bloomed" this config is.
  // 0 = all unset, 1 = all at max intensity.
  getBloomLevel() {
    let active = 0;
    let total = 0;
    for (const key of ALL_KEYS) {
      if (this[key] > 0) {
        active += this[key];
      }
      total += EMOTION_MAX;
    }
    return total > 0 ? active / total : 0;
  }

  // Returns true if any emotional dimension is set (not -1).
  isActive() {
    for (const key of ALL_KEYS) {
      if (this[key] > EMOTION_UNSET) return true;
    }
    return false;
  }

  toJSON() {
    return this.getAll();
  }

  static get GRID_POSITIONS() { return GRID_POSITIONS; }
  static get CORNER_KEYS() { return CORNER_KEYS; }
  static get CROSS_KEYS() { return CROSS_KEYS; }
  static get ALL_KEYS() { return ALL_KEYS; }
  static get DIMENSIONS() { return DIMENSIONS; }
}
