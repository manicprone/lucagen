import { describe, it, expect } from 'vitest';
import EmotionalConfig from '../../src/models/EmotionalConfig.js';

describe('EmotionalConfig', () => {
  it('initializes all values to -1 (unset) by default', () => {
    const config = new EmotionalConfig();
    for (const key of EmotionalConfig.ALL_KEYS) {
      expect(config[key]).toBe(-1);
    }
  });

  it('accepts initial values from data', () => {
    const config = new EmotionalConfig({ s: 1, x: 2, g: 3 });
    expect(config.s).toBe(1);
    expect(config.x).toBe(2);
    expect(config.g).toBe(3);
    expect(config.d).toBe(-1); // unset
  });

  it('getCorners returns the four corner quadrant values', () => {
    const config = new EmotionalConfig({ x: 1, y: 2, o: 3, g: 0 });
    expect(config.getCorners()).toEqual({ x: 1, y: 2, o: 3, g: 0 });
  });

  it('getCross returns the five cross values', () => {
    const config = new EmotionalConfig({ s: 1, L: 2, d: 3, R: 0, n: 1 });
    expect(config.getCross()).toEqual({ s: 1, L: 2, d: 3, R: 0, n: 1 });
  });

  it('getAll returns all 9 values', () => {
    const config = new EmotionalConfig();
    const all = config.getAll();
    expect(Object.keys(all)).toHaveLength(9);
  });

  it('setValue and getValue work correctly', () => {
    const config = new EmotionalConfig();
    config.setValue('x', 2);
    expect(config.getValue('x')).toBe(2);
  });

  it('setValue ignores invalid keys', () => {
    const config = new EmotionalConfig();
    config.setValue('invalid', 5);
    expect(config.invalid).toBeUndefined();
  });

  it('getBloomLevel returns 0 for fully unset config', () => {
    const config = new EmotionalConfig();
    expect(config.getBloomLevel()).toBe(0);
  });

  it('getBloomLevel returns correct ratio for partially set config', () => {
    // 9 cells, max 3 each = 27 total. Set one to 3 = 3/27
    const config = new EmotionalConfig({ s: 3 });
    expect(config.getBloomLevel()).toBeCloseTo(3 / 27);
  });

  it('getBloomLevel returns 1 for fully maxed config', () => {
    const data = {};
    for (const key of EmotionalConfig.ALL_KEYS) {
      data[key] = 3;
    }
    const config = new EmotionalConfig(data);
    expect(config.getBloomLevel()).toBe(1);
  });

  it('isActive returns false when all unset', () => {
    const config = new EmotionalConfig();
    expect(config.isActive()).toBe(false);
  });

  it('isActive returns true when any value > -1', () => {
    const config = new EmotionalConfig({ d: 0 });
    expect(config.isActive()).toBe(true);
  });

  it('toJSON returns plain object', () => {
    const config = new EmotionalConfig({ s: 1 });
    const json = config.toJSON();
    expect(json.s).toBe(1);
    expect(json).not.toBeInstanceOf(EmotionalConfig);
  });

  it('has correct static constants', () => {
    expect(EmotionalConfig.CORNER_KEYS).toEqual(['x', 'y', 'o', 'g']);
    expect(EmotionalConfig.CROSS_KEYS).toEqual(['s', 'L', 'd', 'R', 'n']);
    expect(EmotionalConfig.ALL_KEYS).toHaveLength(9);
    expect(EmotionalConfig.GRID_POSITIONS.x).toEqual({ row: 0, col: 0 });
    expect(EmotionalConfig.DIMENSIONS.x.name).toBe('Intrigue Drive');
  });
});
