// SpatialGrid.js — Grid-based spatial hash for O(1) proximity queries
//
// Divides the world into cells of a fixed size. Each cell holds references
// to dots whose position falls within it. queryNearby() returns all dots
// in cells that overlap the observer's vision range.

import { SPATIAL_CELL_SIZE } from '../config/defaults.js';

export default class SpatialGrid {
  constructor(worldWidth, worldHeight, cellSize = SPATIAL_CELL_SIZE) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(worldWidth / cellSize) + 1;
    this.rows = Math.ceil(worldHeight / cellSize) + 1;
    this.cells = new Map();
  }

  _key(col, row) {
    return col * 10000 + row;
  }

  _cellCoords(x, y) {
    return {
      col: Math.floor(x / this.cellSize),
      row: Math.floor(y / this.cellSize),
    };
  }

  // Rebuild the entire grid from a set of dots.
  // Called once per tick before any queries.
  rebuild(dots) {
    this.cells.clear();

    for (const dot of dots) {
      const { col, row } = this._cellCoords(dot.x1, dot.y1);
      const key = this._key(col, row);
      let cell = this.cells.get(key);
      if (!cell) {
        cell = [];
        this.cells.set(key, cell);
      }
      cell.push(dot);
    }
  }

  // Query all dots near the observer within visionRange pixels.
  // Returns an array of dots (excluding the observer itself).
  queryNearby(observer, visionRange) {
    const nearby = [];

    // Calculate the bounding box of the vision range
    const minX = observer.x1 - visionRange;
    const maxX = observer.x2 + visionRange;
    const minY = observer.y1 - visionRange;
    const maxY = observer.y2 + visionRange;

    // Determine which grid cells overlap this bounding box
    const startCol = Math.floor(minX / this.cellSize);
    const endCol = Math.floor(maxX / this.cellSize);
    const startRow = Math.floor(minY / this.cellSize);
    const endRow = Math.floor(maxY / this.cellSize);

    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        const cell = this.cells.get(this._key(col, row));
        if (cell) {
          for (const dot of cell) {
            if (dot.id !== observer.id) {
              // Fine-grained rectangular check
              if (
                dot.x2 > minX && dot.x1 < maxX &&
                dot.y2 > minY && dot.y1 < maxY
              ) {
                nearby.push(dot);
              }
            }
          }
        }
      }
    }

    return nearby;
  }
}
