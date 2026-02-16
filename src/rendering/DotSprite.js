// DotSprite.js — Visual representation of a Dot entity
//
// A 30px Container holding 9 Graphics objects in a 3x3 grid (10px per cell).
// Each cell represents one position in the emotional config grid:
//
//   x  s  y     (row 0)
//   L  d  R     (row 1)
//   o  n  g     (row 2)
//
// Corner cells (x, y, o, g) are quadrant "petals" — emotional dimensions.
// Center cross cells (s, L, d, R, n) represent the Pride Factor.
//
// Bloom effect: emotional intensity controls the fill size within each cell.
// Glow effect: outer glow on high-intensity dots.
// Breathing: subtle scale oscillation based on stimulation level.

import { Container, Graphics } from 'pixi.js';
import EmotionalConfig from '../models/EmotionalConfig.js';
import { getEmotionalColor, getBloomSize, DOT_BACKGROUND } from '../config/emotional-palette.js';

const CELL_SIZE = 10;
const DOT_SIZE = 30; // 3 cells x 10px

// Glow: appears when bloom level > threshold
const GLOW_BLOOM_THRESHOLD = 0.35;
const GLOW_PADDING = 4; // pixels beyond dot edge
const GLOW_COLOR = 0xffffff;
const GLOW_MAX_ALPHA = 0.12;

// Breathing: scale oscillation
const BREATH_MIN_SCALE = 0.97;
const BREATH_MAX_SCALE = 1.03;
const BREATH_SPEED = 0.002; // radians per ms (we use frame count as proxy)

// Grid layout: key -> { row, col }
const GRID = EmotionalConfig.GRID_POSITIONS;
const ALL_KEYS = EmotionalConfig.ALL_KEYS;

export default class DotSprite {
  constructor(dot) {
    this.dotId = dot.id;

    // Root container for this dot
    this.container = new Container();
    this.container.label = dot.id;

    // Glow layer (drawn behind everything)
    this._glowGfx = new Graphics();
    this.container.addChild(this._glowGfx);

    // Background — a single graphics for the dot body
    this.background = new Graphics();
    this._drawBackground();
    this.container.addChild(this.background);

    // Create 9 cell graphics (one per emotional grid position)
    this.cells = {};
    for (const key of ALL_KEYS) {
      const gfx = new Graphics();
      this.cells[key] = gfx;
      this.container.addChild(gfx);
    }

    // Enable click detection
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.hitArea = { contains: (x, y) => x >= -GLOW_PADDING && x <= DOT_SIZE + GLOW_PADDING && y >= -GLOW_PADDING && y <= DOT_SIZE + GLOW_PADDING };

    // Breathing state
    this._breathPhase = Math.random() * Math.PI * 2; // random start phase
    this._lastBloomLevel = 0;

    // Set initial position + pivot for scale from center
    this.container.pivot.set(DOT_SIZE / 2, DOT_SIZE / 2);
    this.container.position.set(dot.x1 + DOT_SIZE / 2, dot.y1 + DOT_SIZE / 2);

    // Initial emotional render
    this.updateEmotions(dot.emotionalConfig);
  }

  _drawBackground() {
    this.background.clear();
    this.background
      .rect(0, 0, DOT_SIZE, DOT_SIZE)
      .fill({ color: DOT_BACKGROUND, alpha: 1 });
  }

  /**
   * Update the visual representation of emotional state.
   */
  updateEmotions(emotionalConfig) {
    for (const key of ALL_KEYS) {
      const gfx = this.cells[key];
      const value = emotionalConfig[key];
      const { row, col } = GRID[key];

      gfx.clear();

      const bloomRatio = getBloomSize(value);
      if (bloomRatio <= 0) continue;

      const { color, alpha } = getEmotionalColor(key, value);

      const cellX = col * CELL_SIZE;
      const cellY = row * CELL_SIZE;
      const fillSize = CELL_SIZE * bloomRatio;
      const offset = (CELL_SIZE - fillSize) / 2;

      gfx.rect(cellX + offset, cellY + offset, fillSize, fillSize)
        .fill({ color, alpha });
    }

    // Update glow based on overall bloom level
    this._lastBloomLevel = emotionalConfig.getBloomLevel();
    this._updateGlow();
  }

  /**
   * Draw or clear the outer glow based on bloom level.
   */
  _updateGlow() {
    this._glowGfx.clear();

    if (this._lastBloomLevel < GLOW_BLOOM_THRESHOLD) return;

    // Scale glow intensity with bloom level
    const intensity = (this._lastBloomLevel - GLOW_BLOOM_THRESHOLD) / (1 - GLOW_BLOOM_THRESHOLD);
    const alpha = GLOW_MAX_ALPHA * intensity;

    this._glowGfx
      .rect(-GLOW_PADDING, -GLOW_PADDING, DOT_SIZE + GLOW_PADDING * 2, DOT_SIZE + GLOW_PADDING * 2)
      .fill({ color: GLOW_COLOR, alpha });
  }

  /**
   * Subtle scale oscillation based on stimulation (s).
   * Higher stimulation = more pronounced breathing.
   */
  updateBreathing(dot) {
    this._breathPhase += BREATH_SPEED * 16.67; // ~60fps frame time

    const stimulation = dot.emotionalConfig.s;
    if (stimulation <= 0) {
      this.container.scale.set(1);
      return;
    }

    // Amplitude scales with stimulation (0..3 -> 0..full range)
    const amplitude = (stimulation / 3) * (BREATH_MAX_SCALE - BREATH_MIN_SCALE) / 2;
    const midpoint = 1;
    const scale = midpoint + Math.sin(this._breathPhase) * amplitude;

    this.container.scale.set(scale);
  }

  /**
   * Update position with interpolation.
   * Accounts for pivot offset (center of dot).
   */
  updatePosition(dot, alpha) {
    const x = dot.prevX1 + (dot.x1 - dot.prevX1) * alpha;
    const y = dot.prevY1 + (dot.y1 - dot.prevY1) * alpha;
    this.container.position.set(x + DOT_SIZE / 2, y + DOT_SIZE / 2);
  }

  /**
   * Reinitialize a pooled sprite for a new dot (avoids alloc).
   */
  reinit(dot) {
    this.dotId = dot.id;
    this.container.label = dot.id;
    this._breathPhase = Math.random() * Math.PI * 2;
    this._lastBloomLevel = 0;
    this.container.scale.set(1);
    this.container.visible = true;
    this.container.position.set(dot.x1 + DOT_SIZE / 2, dot.y1 + DOT_SIZE / 2);
    this.updateEmotions(dot.emotionalConfig);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
