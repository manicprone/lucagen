import { describe, it, expect } from 'vitest';
import World from '../../src/models/World.js';
import Dot from '../../src/models/Dot.js';

describe('World', () => {
  it('creates with default values', () => {
    const world = new World();
    expect(world.type).toBe('DotWorld');
    expect(world.width).toBe(450);
    expect(world.height).toBe(270);
    expect(world.polarity).toBe('U');
    expect(world.chirality).toBe('R');
    expect(world.x1).toBe(0);
    expect(world.x2).toBe(451);
    expect(world.y1).toBe(0);
    expect(world.y2).toBe(271);
    expect(world.dots).toEqual([]);
    expect(world.dotRegistry).toEqual({});
    expect(world.freedomMode).toBe(true);
    expect(world.spatialGrid).toBeNull();
  });

  it('creates with custom dimensions', () => {
    const world = new World({ width: 800, height: 600 });
    expect(world.width).toBe(800);
    expect(world.height).toBe(600);
    expect(world.x2).toBe(801);
    expect(world.y2).toBe(601);
  });

  it('addDot registers a dot', () => {
    const world = new World();
    const dot = new Dot({ id: 'dot-1', name: 'Alpha' });
    world.addDot(dot);
    expect(world.dots).toEqual(['dot-1']);
    expect(world.dotRegistry['dot-1']).toBe(dot);
    expect(world.getDotCount()).toBe(1);
  });

  it('addDot does not duplicate IDs', () => {
    const world = new World();
    const dot = new Dot({ id: 'dot-1' });
    world.addDot(dot);
    world.addDot(dot);
    expect(world.dots).toEqual(['dot-1']);
  });

  it('removeDot removes a dot', () => {
    const world = new World();
    const dot = new Dot({ id: 'dot-1' });
    world.addDot(dot);
    world.removeDot('dot-1');
    expect(world.dots).toEqual([]);
    expect(world.dotRegistry['dot-1']).toBeUndefined();
  });

  it('getDot returns dot or null', () => {
    const world = new World();
    const dot = new Dot({ id: 'dot-1' });
    world.addDot(dot);
    expect(world.getDot('dot-1')).toBe(dot);
    expect(world.getDot('nonexistent')).toBeNull();
  });

  it('forEachDot iterates over all dots', () => {
    const world = new World();
    world.addDot(new Dot({ id: 'a' }));
    world.addDot(new Dot({ id: 'b' }));
    const ids = [];
    world.forEachDot(dot => ids.push(dot.id));
    expect(ids).toEqual(['a', 'b']);
  });

  it('pauseDots and resumeDots toggle sleep', () => {
    const world = new World();
    const dot = new Dot({ id: 'dot-1' });
    dot.wake();
    world.addDot(dot);

    world.pauseDots();
    expect(dot.isAsleep).toBe(true);

    world.resumeDots();
    expect(dot.isAsleep).toBe(false);
  });

  it('setFreedom sets freedomMode', () => {
    const world = new World();
    world.setFreedom(false);
    expect(world.freedomMode).toBe(false);
    world.setFreedom(true);
    expect(world.freedomMode).toBe(true);
  });
});
