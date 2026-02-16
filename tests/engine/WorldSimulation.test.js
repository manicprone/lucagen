import { describe, it, expect } from 'vitest';
import WorldSimulation from '../../src/engine/WorldSimulation.js';
import World from '../../src/models/World.js';
import Dot from '../../src/models/Dot.js';

describe('WorldSimulation', () => {
  function createSimulation() {
    const world = new World({ width: 450, height: 270 });
    return new WorldSimulation(world);
  }

  it('creates with world and spatial grid', () => {
    const sim = createSimulation();
    expect(sim.world).toBeDefined();
    expect(sim.spatialGrid).toBeDefined();
    expect(sim.world.spatialGrid).toBe(sim.spatialGrid);
    expect(sim.tickCount).toBe(0);
  });

  it('spawnDot adds and wakes a dot', () => {
    const sim = createSimulation();
    const dot = new Dot({ id: 'dot-1', birthX: 100, birthY: 100 });
    sim.spawnDot(dot);

    expect(sim.world.getDotCount()).toBe(1);
    expect(dot.isAsleep).toBe(false);
  });

  it('tick with no awake dots does nothing', () => {
    const sim = createSimulation();
    sim.tick();
    // tickCount does not increment when there are no awake dots
    expect(sim.tickCount).toBe(0);
  });

  it('tick moves dots', () => {
    const sim = createSimulation();
    const dot = new Dot({ id: 'dot-1', birthX: 100, birthY: 100 });
    sim.spawnDot(dot);

    const origX1 = dot.x1;
    const origY1 = dot.y1;

    sim.tick();

    // Dot should have moved (either x or y changed)
    const moved = dot.x1 !== origX1 || dot.y1 !== origY1;
    expect(moved).toBe(true);
    expect(dot.steps).toBe(1);
    expect(dot.events).toBe(1);
    expect(sim.tickCount).toBe(1);
  });

  it('tick saves previous positions for interpolation', () => {
    const sim = createSimulation();
    const dot = new Dot({ id: 'dot-1', birthX: 100, birthY: 100 });
    sim.spawnDot(dot);

    sim.tick();

    // prevX1/prevY1 should be the original position
    expect(dot.prevX1).toBe(100);
    expect(dot.prevY1).toBe(100);
  });

  it('multiple ticks accumulate steps', () => {
    const sim = createSimulation();
    const dot = new Dot({ id: 'dot-1', birthX: 200, birthY: 100 });
    sim.spawnDot(dot);

    sim.tick();
    sim.tick();
    sim.tick();

    expect(dot.steps).toBe(3);
    expect(dot.events).toBe(3);
    expect(sim.tickCount).toBe(3);
  });

  it('handles multiple dots simultaneously', () => {
    const sim = createSimulation();
    const dot1 = new Dot({ id: 'a', birthX: 100, birthY: 100 });
    const dot2 = new Dot({ id: 'b', birthX: 300, birthY: 200 });
    sim.spawnDot(dot1);
    sim.spawnDot(dot2);

    sim.tick();

    expect(dot1.steps).toBe(1);
    expect(dot2.steps).toBe(1);
  });

  it('removeDot removes a dot from the world', () => {
    const sim = createSimulation();
    const dot = new Dot({ id: 'dot-1' });
    sim.spawnDot(dot);
    expect(sim.world.getDotCount()).toBe(1);

    sim.removeDot('dot-1');
    expect(sim.world.getDotCount()).toBe(0);
  });

  it('resize updates world dimensions and spatial grid', () => {
    const sim = createSimulation();
    sim.resize(800, 600);

    expect(sim.world.width).toBe(800);
    expect(sim.world.height).toBe(600);
    expect(sim.world.x2).toBe(801);
    expect(sim.world.y2).toBe(601);
    expect(sim.world.spatialGrid).toBe(sim.spatialGrid);
  });

  it('dots avoid walls during movement', () => {
    const sim = createSimulation();
    // Place dot near top-left corner
    const dot = new Dot({ id: 'dot-1', birthX: 1, birthY: 1 });
    sim.spawnDot(dot);

    // Run several ticks - dot should never go out of bounds
    for (let i = 0; i < 20; i++) {
      sim.tick();
      expect(dot.x1).toBeGreaterThan(sim.world.x1);
      expect(dot.y1).toBeGreaterThan(sim.world.y1);
      expect(dot.x2).toBeLessThan(sim.world.x2);
      expect(dot.y2).toBeLessThan(sim.world.y2);
    }
  });
});
