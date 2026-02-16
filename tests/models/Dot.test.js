import { describe, it, expect } from 'vitest';
import Dot from '../../src/models/Dot.js';
import EmotionalConfig from '../../src/models/EmotionalConfig.js';

describe('Dot', () => {
  it('creates with default values', () => {
    const dot = new Dot();
    expect(dot.type).toBe('Dot');
    expect(dot.width).toBe(30);
    expect(dot.height).toBe(30);
    expect(dot.speed).toBe(200);
    expect(dot.visionDepth).toBe(3);
    expect(dot.memoryDepth).toBe(5);
    expect(dot.isAsleep).toBe(true);
    expect(dot.steps).toBe(0);
    expect(dot.currentDirection).toBeNull();
    expect(dot.moveShiftHistory).toEqual([]);
    expect(dot.events).toBe(0);
    expect(dot.emotionalConfig).toBeInstanceOf(EmotionalConfig);
  });

  it('creates with custom data', () => {
    const dot = new Dot({
      id: 'test-dot',
      name: 'Testy',
      birthX: 100,
      birthY: 50,
      width: 15,
    });
    expect(dot.id).toBe('test-dot');
    expect(dot.name).toBe('Testy');
    expect(dot.birthX).toBe(100);
    expect(dot.birthY).toBe(50);
    expect(dot.x1).toBe(100);
    expect(dot.x2).toBe(114); // 100 + 15 - 1
    expect(dot.y1).toBe(50);
    expect(dot.y2).toBe(79); // 50 + 30 - 1 (height defaults to 30)
  });

  it('calculates default vertices from birth position', () => {
    const dot = new Dot({ birthX: 10, birthY: 20 });
    expect(dot.x1).toBe(10);
    expect(dot.x2).toBe(39); // 10 + 30 - 1
    expect(dot.y1).toBe(20);
    expect(dot.y2).toBe(49); // 20 + 30 - 1
  });

  it('initializes prevX1/prevY1 for interpolation', () => {
    const dot = new Dot({ birthX: 10, birthY: 20 });
    expect(dot.prevX1).toBe(10);
    expect(dot.prevY1).toBe(20);
  });

  it('sleep and wake toggle isAsleep', () => {
    const dot = new Dot();
    expect(dot.isAsleep).toBe(true);
    dot.wake();
    expect(dot.isAsleep).toBe(false);
    dot.sleep();
    expect(dot.isAsleep).toBe(true);
  });

  it('savePosition stores current position as previous', () => {
    const dot = new Dot({ birthX: 10, birthY: 20 });
    dot.x1 = 40;
    dot.y1 = 50;
    dot.savePosition();
    expect(dot.prevX1).toBe(40);
    expect(dot.prevY1).toBe(50);
  });

  it('applyMove updates dot properties', () => {
    const dot = new Dot({ birthX: 10, birthY: 20 });
    dot.applyMove({ x1: 40, y1: 50, steps: 1, currentDirection: 'e' });
    expect(dot.x1).toBe(40);
    expect(dot.y1).toBe(50);
    expect(dot.steps).toBe(1);
    expect(dot.currentDirection).toBe('e');
  });

  it('accepts EmotionalConfig instance in constructor', () => {
    const config = new EmotionalConfig({ s: 2, x: 1 });
    const dot = new Dot({ emotionalConfig: config });
    expect(dot.emotionalConfig).toBe(config); // same instance
    expect(dot.emotionalConfig.s).toBe(2);
  });

  it('creates EmotionalConfig from plain object', () => {
    const dot = new Dot({ emotionalConfig: { s: 3 } });
    expect(dot.emotionalConfig).toBeInstanceOf(EmotionalConfig);
    expect(dot.emotionalConfig.s).toBe(3);
  });

  it('generates unique IDs for each dot', () => {
    const dot1 = new Dot();
    const dot2 = new Dot();
    expect(dot1.id).not.toBe(dot2.id);
  });
});
