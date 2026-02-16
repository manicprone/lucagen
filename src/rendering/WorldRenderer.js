// WorldRenderer.js — Maps simulation dots to DotSprite instances
//
// sync(world) — Adds sprites for new dots, removes sprites for removed dots.
// render(alpha) — Interpolates positions and updates emotional colors per frame.

import DotSprite from './DotSprite.js';

export default class WorldRenderer {
  constructor(stage) {
    this.stage = stage;
    this.sprites = new Map(); // dotId -> DotSprite
    this._world = null;
  }

  /**
   * Synchronize sprites with the current world state.
   * Adds sprites for new dots, removes sprites for dots no longer in the world.
   */
  sync(world) {
    this._world = world;
    const currentIds = new Set(world.dots);

    // Remove sprites for dots that no longer exist
    for (const [dotId, sprite] of this.sprites) {
      if (!currentIds.has(dotId)) {
        this.stage.removeChild(sprite.container);
        sprite.destroy();
        this.sprites.delete(dotId);
      }
    }

    // Add sprites for new dots
    for (const dotId of world.dots) {
      if (!this.sprites.has(dotId)) {
        const dot = world.dotRegistry[dotId];
        if (dot) {
          const sprite = new DotSprite(dot);
          this.sprites.set(dotId, sprite);
          this.stage.addChild(sprite.container);
        }
      }
    }
  }

  /**
   * Render frame: interpolate positions and update emotional colors.
   * Called at display refresh rate (60fps).
   *
   * @param {number} alpha - Interpolation factor (0..1) between last tick and next
   */
  render(alpha) {
    if (!this._world) return;

    for (const [dotId, sprite] of this.sprites) {
      const dot = this._world.dotRegistry[dotId];
      if (!dot) continue;

      // Interpolate position for smooth rendering
      sprite.updatePosition(dot, alpha);

      // Update emotional visualization
      sprite.updateEmotions(dot.emotionalConfig);
    }
  }

  /**
   * Get the DotSprite for a given dot ID (for inspection, click detection, etc.)
   */
  getSprite(dotId) {
    return this.sprites.get(dotId) ?? null;
  }

  get spriteCount() {
    return this.sprites.size;
  }
}
