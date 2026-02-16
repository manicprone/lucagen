import { describe, it, expect } from 'vitest';
import SpatialGrid from '../../src/engine/SpatialGrid.js';
import Dot from '../../src/models/Dot.js';

describe('SpatialGrid', () => {
  function makeDot(id, x, y) {
    return new Dot({ id, birthX: x, birthY: y });
  }

  it('creates with correct dimensions', () => {
    const grid = new SpatialGrid(450, 270, 100);
    expect(grid.cellSize).toBe(100);
    expect(grid.cols).toBe(6); // ceil(450/100) + 1
    expect(grid.rows).toBe(4); // ceil(270/100) + 1
  });

  it('rebuild clears and repopulates', () => {
    const grid = new SpatialGrid(450, 270, 100);
    const dot1 = makeDot('a', 10, 10);
    const dot2 = makeDot('b', 200, 200);

    grid.rebuild([dot1, dot2]);
    expect(grid.cells.size).toBeGreaterThan(0);

    // Rebuild with empty clears
    grid.rebuild([]);
    expect(grid.cells.size).toBe(0);
  });

  it('queryNearby finds dots within range', () => {
    const grid = new SpatialGrid(450, 270, 100);
    const observer = makeDot('obs', 100, 100);
    const nearby = makeDot('near', 140, 100); // 40px away
    const farAway = makeDot('far', 400, 400); // very far

    grid.rebuild([observer, nearby, farAway]);

    // Vision range covers nearby but not far
    const results = grid.queryNearby(observer, 60);
    expect(results.map(d => d.id)).toContain('near');
    expect(results.map(d => d.id)).not.toContain('far');
  });

  it('queryNearby excludes the observer itself', () => {
    const grid = new SpatialGrid(450, 270, 100);
    const observer = makeDot('obs', 100, 100);
    const nearby = makeDot('near', 110, 100);

    grid.rebuild([observer, nearby]);

    const results = grid.queryNearby(observer, 200);
    expect(results.map(d => d.id)).not.toContain('obs');
  });

  it('queryNearby returns empty for isolated dot', () => {
    const grid = new SpatialGrid(1000, 1000, 100);
    const observer = makeDot('obs', 10, 10);
    const farAway = makeDot('far', 900, 900);

    grid.rebuild([observer, farAway]);

    const results = grid.queryNearby(observer, 50);
    expect(results).toHaveLength(0);
  });

  it('queryNearby handles dots at same position', () => {
    const grid = new SpatialGrid(450, 270, 100);
    const obs = makeDot('obs', 100, 100);
    const same = makeDot('same', 100, 100);

    grid.rebuild([obs, same]);

    const results = grid.queryNearby(obs, 10);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('same');
  });

  it('queryNearby handles dots spanning cell boundaries', () => {
    const grid = new SpatialGrid(450, 270, 100);
    // Observer at edge of cell boundary
    const obs = makeDot('obs', 95, 95);
    // Dot just across the cell boundary
    const across = makeDot('across', 105, 105);

    grid.rebuild([obs, across]);

    const results = grid.queryNearby(obs, 50);
    expect(results.map(d => d.id)).toContain('across');
  });
});
