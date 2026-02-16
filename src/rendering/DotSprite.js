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
// Low intensity = small centered fill. Max intensity = fills entire cell.
// Color comes from emotional-palette.js, alpha from intensity.

import { Container, Graphics } from 'pixi.js';
import EmotionalConfig from '../models/EmotionalConfig.js';
import { getEmotionalColor, getBloomSize, DOT_BACKGROUND } from '../config/emotional-palette.js';

const CELL_SIZE = 10;
const DOT_SIZE = 30; // 3 cells x 10px

// Grid layout: key -> { row, col }
const GRID = EmotionalConfig.GRID_POSITIONS;
const ALL_KEYS = EmotionalConfig.ALL_KEYS;

export default class DotSprite {
  constructor(dot) {
    this.dotId = dot.id;

    // Root container for this dot
    this.container = new Container();
    this.container.label = dot.id;

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
    this.container.hitArea = { contains: (x, y) => x >= 0 && x <= DOT_SIZE && y >= 0 && y <= DOT_SIZE };

    // Set initial position
    this.container.position.set(dot.x1, dot.y1);

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
   * Each cell is redrawn based on the emotional config values.
   */
  updateEmotions(emotionalConfig) {
    for (const key of ALL_KEYS) {
      const gfx = this.cells[key];
      const value = emotionalConfig[key];
      const { row, col } = GRID[key];

      gfx.clear();

      const bloomRatio = getBloomSize(value);
      if (bloomRatio <= 0) continue; // nothing to draw

      const { color, alpha } = getEmotionalColor(key, value);

      // Calculate cell position and bloom size
      const cellX = col * CELL_SIZE;
      const cellY = row * CELL_SIZE;
      const fillSize = CELL_SIZE * bloomRatio;
      const offset = (CELL_SIZE - fillSize) / 2;

      gfx.rect(cellX + offset, cellY + offset, fillSize, fillSize)
        .fill({ color, alpha });
    }
  }

  /**
   * Update position with interpolation between previous and current.
   * @param {object} dot - The dot model
   * @param {number} alpha - Interpolation factor (0..1)
   */
  updatePosition(dot, alpha) {
    const x = dot.prevX1 + (dot.x1 - dot.prevX1) * alpha;
    const y = dot.prevY1 + (dot.y1 - dot.prevY1) * alpha;
    this.container.position.set(x, y);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
