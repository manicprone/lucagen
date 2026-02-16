// Dot.js — An autonomous entity in DotWorld
//
// The motivation of a Dot:
//   (1) To keep stimulated and avoid listlessness
//   (2) To seek a higher level of pride
//
// The life of a Dot (each tick):
//   (1) Determine physical movement (step or stay still)
//       (a) Look for interaction (if feeling social)
//           -or- Avoid interaction (if feeling anti-social)
//       (b) Avoid walls and collisions
//   (2) Interact (if interaction occurs)
//       (a) Exchange with other(s)
//       (b) Evaluate other(s) individually
//       (c) Evaluate world as a whole
//   (3) Evaluate self
//       (a) Assess all emotional states
//       (b) Qualify motivation in world
//       (c) Calculate level of pride

import EmotionalConfig from './EmotionalConfig.js';
import { DOT_SIZE, DOT_SPEED, DOT_VISION_DEPTH, DOT_MEMORY_DEPTH } from '../config/defaults.js';

let dotCounter = 0;

export default class Dot {
  constructor(data = {}) {
    this.type = 'Dot';

    // --- Identification ---
    this.id = data.id ?? `dot-${++dotCounter}`;
    this.name = data.name ?? this.id;

    // --- Birthplace ---
    this.birthX = data.birthX ?? 1;
    this.birthY = data.birthY ?? 1;

    // --- Size ---
    this.width = data.width ?? DOT_SIZE;
    this.height = data.height ?? DOT_SIZE;

    // --- Speed ---
    this.speed = data.speed ?? DOT_SPEED;

    // --- Vision ---
    this.visionDepth = data.visionDepth ?? DOT_VISION_DEPTH;

    // --- Memory ---
    // memoryDepth => max size of moveShiftHistory array
    this.memoryDepth = data.memoryDepth ?? DOT_MEMORY_DEPTH;

    // --- Location (vertices) ---
    this.x1 = data.x1 ?? this.birthX;
    this.x2 = data.x2 ?? (this.birthX + this.width - 1);
    this.y1 = data.y1 ?? this.birthY;
    this.y2 = data.y2 ?? (this.birthY + this.height - 1);
    this.fromX = data.fromX ?? 0;
    this.fromY = data.fromY ?? 0;

    // --- Interpolation (for smooth rendering) ---
    this.prevX1 = data.prevX1 ?? this.x1;
    this.prevY1 = data.prevY1 ?? this.y1;

    // --- Movement ---
    this.isAsleep = data.isAsleep ?? true;
    this.steps = data.steps ?? 0;
    this.currentDirection = data.currentDirection ?? null;
    this.moveShiftHistory = data.moveShiftHistory ?? [];

    // --- Interaction ---
    this.events = data.events ?? 0;
    this.totalInteractions = data.totalInteractions ?? 0;
    this.totalInteractionsInitiated = data.totalInteractionsInitiated ?? 0;
    this.recipientInteractions = data.recipientInteractions ?? {};
    this.stepContracts = data.stepContracts ?? {};

    // --- Convictions ---
    // conviction types: step (intents: meet, follow, rest, avoid, hide)
    this.convictions = data.convictions ?? {};

    // --- Emotional Config ---
    this.emotionalConfig = data.emotionalConfig instanceof EmotionalConfig
      ? data.emotionalConfig
      : new EmotionalConfig(data.emotionalConfig ?? {});
  }

  sleep() {
    this.isAsleep = true;
  }

  wake() {
    this.isAsleep = false;
  }

  // Save current position for interpolation before computing next move
  savePosition() {
    this.prevX1 = this.x1;
    this.prevY1 = this.y1;
  }

  // Apply everything that changed during this tick
  applyMove(endState) {
    for (const attr of Object.keys(endState)) {
      this[attr] = endState[attr];
    }
  }
}
