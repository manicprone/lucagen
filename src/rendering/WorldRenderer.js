// WorldRenderer.js — Maps simulation dots to DotSprite instances
//
// sync(world) — Adds/removes sprites for dots entering/leaving the world.
// render(alpha) — Interpolates positions, updates emotions, draws contract lines.

import { Graphics } from 'pixi.js';
import DotSprite from './DotSprite.js';

// Performance: only update emotional visuals every N render frames
const EMOTION_UPDATE_INTERVAL = 5;

// Contract line styling
const CONTRACT_LINE_COLOR = 0x4a9eff;
const CONTRACT_LINE_ALPHA = 0.15;
const CONTRACT_LINE_WIDTH = 1;

export default class WorldRenderer {
  constructor(stage) {
    this.stage = stage;
    this.sprites = new Map(); // dotId -> DotSprite
    this._world = null;
    this._frameCount = 0;

    // Object pool for recycled DotSprites
    this._pool = [];
    this._poolMaxSize = 200;

    // Viewport bounds for frustum culling (updated on render)
    this._viewW = 0;
    this._viewH = 0;

    // Dedicated graphics layer for interaction lines (drawn below dots)
    this._linesGfx = new Graphics();
    this.stage.addChild(this._linesGfx);
  }

  /**
   * Synchronize sprites with the current world state.
   * Uses object pooling: recycled sprites go to a pool instead of being destroyed.
   */
  sync(world) {
    this._world = world;
    const currentIds = new Set(world.dots);

    // Remove sprites for dots that no longer exist — recycle to pool
    for (const [dotId, sprite] of this.sprites) {
      if (!currentIds.has(dotId)) {
        this.stage.removeChild(sprite.container);
        if (this._pool.length < this._poolMaxSize) {
          this._pool.push(sprite);
        } else {
          sprite.destroy();
        }
        this.sprites.delete(dotId);
      }
    }

    // Add sprites for new dots — reuse from pool when possible
    for (const dotId of world.dots) {
      if (!this.sprites.has(dotId)) {
        const dot = world.dotRegistry[dotId];
        if (dot) {
          let sprite;
          if (this._pool.length > 0) {
            sprite = this._pool.pop();
            sprite.reinit(dot);
          } else {
            sprite = new DotSprite(dot);
          }
          this.sprites.set(dotId, sprite);
          this.stage.addChild(sprite.container);
        }
      }
    }
  }

  /**
   * Render frame: interpolate positions, update emotions, draw contract lines.
   *
   * @param {number} alpha - Interpolation factor (0..1)
   */
  /**
   * Update viewport dimensions (call on resize).
   */
  setViewport(width, height) {
    this._viewW = width;
    this._viewH = height;
  }

  render(alpha) {
    if (!this._world) return;

    this._frameCount++;
    const updateEmotions = this._frameCount % EMOTION_UPDATE_INTERVAL === 0;
    const cull = this._viewW > 0 && this._viewH > 0;
    const pad = 40; // padding beyond viewport for culling

    for (const [dotId, sprite] of this.sprites) {
      const dot = this._world.dotRegistry[dotId];
      if (!dot) continue;

      // Interpolate position every frame (smooth movement)
      sprite.updatePosition(dot, alpha);

      // Frustum culling: hide sprites fully off-screen
      if (cull) {
        const sx = sprite.container.position.x;
        const sy = sprite.container.position.y;
        const offScreen = sx < -pad || sx > this._viewW + pad || sy < -pad || sy > this._viewH + pad;
        sprite.container.visible = !offScreen;
        if (offScreen) continue;
      }

      // Update emotional visualization less frequently (perf)
      if (updateEmotions) {
        sprite.updateEmotions(dot.emotionalConfig);
        sprite.updateBreathing(dot);
      }
    }

    // Draw contract lines
    this._drawContractLines(alpha);
  }

  /**
   * Draw thin lines between dots with active step contracts.
   */
  _drawContractLines(alpha) {
    const gfx = this._linesGfx;
    gfx.clear();

    if (!this._world) return;

    const drawn = new Set(); // avoid duplicate lines

    for (const [dotId, sprite] of this.sprites) {
      const dot = this._world.dotRegistry[dotId];
      if (!dot || !dot.stepContracts.members) continue;

      const members = dot.stepContracts.members;
      for (const otherId of Object.keys(members)) {
        // Skip if already drawn from the other side
        const pairKey = dotId < otherId ? `${dotId}:${otherId}` : `${otherId}:${dotId}`;
        if (drawn.has(pairKey)) continue;
        drawn.add(pairKey);

        const otherSprite = this.sprites.get(otherId);
        if (!otherSprite) continue;

        const otherDot = this._world.dotRegistry[otherId];
        if (!otherDot) continue;

        // Interpolated center positions
        const x1 = dot.prevX1 + (dot.x1 - dot.prevX1) * alpha + 15;
        const y1 = dot.prevY1 + (dot.y1 - dot.prevY1) * alpha + 15;
        const x2 = otherDot.prevX1 + (otherDot.x1 - otherDot.prevX1) * alpha + 15;
        const y2 = otherDot.prevY1 + (otherDot.y1 - otherDot.prevY1) * alpha + 15;

        gfx.moveTo(x1, y1)
          .lineTo(x2, y2)
          .stroke({ width: CONTRACT_LINE_WIDTH, color: CONTRACT_LINE_COLOR, alpha: CONTRACT_LINE_ALPHA });
      }
    }
  }

  getSprite(dotId) {
    return this.sprites.get(dotId) ?? null;
  }

  get spriteCount() {
    return this.sprites.size;
  }
}
