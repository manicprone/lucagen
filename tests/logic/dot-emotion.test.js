import { describe, it, expect } from 'vitest';
import Dot from '../../src/models/Dot.js';
import World from '../../src/models/World.js';
import * as dotEmotion from '../../src/logic/dot-emotion.js';

describe('dot-emotion', () => {
  describe('evaluate', () => {
    it('increases stimulation when dot is moving', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, currentDirection: 'e', emotionalConfig: { s: 1 } });
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.s;
      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.s).toBeGreaterThan(before);
    });

    it('decreases stimulation when dot is idle', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, currentDirection: null, emotionalConfig: { s: 2 } });
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.s;
      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.s).toBeLessThan(before);
    });

    it('activates unset dimensions during evaluation', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, currentDirection: 'n' });
      const world = new World({ width: 450, height: 270 });

      dotEmotion.evaluate(dot, world);

      // Stimulation should have been activated from -1 and then modified
      expect(dot.emotionalConfig.s).toBeGreaterThanOrEqual(0);
    });

    it('increases comfort when in open space', () => {
      const dot = new Dot({ birthX: 200, birthY: 100, emotionalConfig: { o: 1 } });
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.o;
      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.o).toBeGreaterThan(before);
    });

    it('decreases comfort when near walls', () => {
      // Place dot near top-left corner (near both walls)
      const dot = new Dot({ birthX: 1, birthY: 1, emotionalConfig: { o: 2 } });
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.o;
      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.o).toBeLessThan(before);
    });

    it('decreases connectedness when isolated', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { g: 2 } });
      dot.stepContracts = {}; // no contracts
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.g;
      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.g).toBeLessThan(before);
    });

    it('increases connectedness when has active contracts', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { g: 1 } });
      dot.stepContracts = { members: { 'other-dot': { intent: 'avoid' } } };
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.g;
      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.g).toBeGreaterThan(before);
    });

    it('clamps emotions to max value', () => {
      const dot = new Dot({ birthX: 200, birthY: 100, currentDirection: 'e', emotionalConfig: { s: 3 } });
      const world = new World({ width: 450, height: 270 });

      dotEmotion.evaluate(dot, world);

      expect(dot.emotionalConfig.s).toBeLessThanOrEqual(3);
    });

    it('clamps emotions to min value', () => {
      const dot = new Dot({ birthX: 1, birthY: 1, currentDirection: null, emotionalConfig: { o: 0 } });
      const world = new World({ width: 450, height: 270 });

      // Evaluate multiple times to push o toward 0
      for (let i = 0; i < 50; i++) {
        dotEmotion.evaluate(dot, world);
      }

      expect(dot.emotionalConfig.o).toBeGreaterThanOrEqual(0);
    });

    it('assesses pride based on corner averages', () => {
      const dot = new Dot({
        birthX: 200, birthY: 100,
        emotionalConfig: { x: 3, y: 3, o: 3, g: 3, d: 1 },
      });
      const world = new World({ width: 450, height: 270 });

      const before = dot.emotionalConfig.d;
      dotEmotion.evaluate(dot, world);

      // High corners should push pride (cross) up
      expect(dot.emotionalConfig.d).toBeGreaterThan(before);
    });
  });

  describe('applyContagion', () => {
    it('pulls dot emotions toward neighbor average', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { x: 1 } });
      const neighbor1 = new Dot({ birthX: 110, birthY: 100, emotionalConfig: { x: 3 } });
      const neighbor2 = new Dot({ birthX: 120, birthY: 100, emotionalConfig: { x: 3 } });

      const before = dot.emotionalConfig.x;
      dotEmotion.applyContagion(dot, [neighbor1, neighbor2]);

      // x should move toward 3 (neighbor average)
      expect(dot.emotionalConfig.x).toBeGreaterThan(before);
    });

    it('does nothing with no neighbors', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { x: 1 } });

      const before = dot.emotionalConfig.x;
      dotEmotion.applyContagion(dot, []);

      expect(dot.emotionalConfig.x).toBe(before);
    });

    it('activates unset dimensions from neighbors', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 }); // all unset (-1)
      const neighbor = new Dot({ birthX: 110, birthY: 100, emotionalConfig: { g: 2 } });

      dotEmotion.applyContagion(dot, [neighbor]);

      // g should be activated and moved toward neighbor value
      expect(dot.emotionalConfig.g).toBeGreaterThan(-1);
    });

    it('does not affect dimensions that are unset on all neighbors', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { x: 1 } });
      const neighbor = new Dot({ birthX: 110, birthY: 100 }); // all unset

      dotEmotion.applyContagion(dot, [neighbor]);

      // x should be unchanged since neighbor has no opinion
      expect(dot.emotionalConfig.x).toBe(1);
    });

    it('produces convergence over many ticks', () => {
      const dot1 = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { x: 0 } });
      const dot2 = new Dot({ birthX: 110, birthY: 100, emotionalConfig: { x: 3 } });

      // Apply contagion many times
      for (let i = 0; i < 100; i++) {
        dotEmotion.applyContagion(dot1, [dot2]);
        dotEmotion.applyContagion(dot2, [dot1]);
      }

      // They should converge toward similar values
      const diff = Math.abs(dot1.emotionalConfig.x - dot2.emotionalConfig.x);
      expect(diff).toBeLessThan(0.5);
    });
  });

  describe('calculateConformityRatio', () => {
    it('returns 1 when alone', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { s: 1 } });
      expect(dotEmotion.calculateConformityRatio(dot, [])).toBe(1);
    });

    it('returns 1 when self intensity is 0', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 }); // all unset
      const other = new Dot({ birthX: 110, birthY: 100, emotionalConfig: { s: 2 } });
      expect(dotEmotion.calculateConformityRatio(dot, [other])).toBe(1);
    });

    it('returns > 1 when dot is more intense than neighbors', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { x: 3, y: 3, o: 3, g: 3, s: 3, L: 3, d: 3, R: 3, n: 3 } });
      const other = new Dot({ birthX: 110, birthY: 100, emotionalConfig: { s: 1 } });
      const ratio = dotEmotion.calculateConformityRatio(dot, [other]);
      expect(ratio).toBeGreaterThan(1);
    });

    it('returns < 1 when dot is less intense than neighbors', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, emotionalConfig: { s: 1 } });
      const other = new Dot({ birthX: 110, birthY: 100, emotionalConfig: { x: 3, y: 3, o: 3, g: 3, s: 3, L: 3, d: 3, R: 3, n: 3 } });
      const ratio = dotEmotion.calculateConformityRatio(dot, [other]);
      expect(ratio).toBeLessThan(1);
    });
  });
});
