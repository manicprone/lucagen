import { describe, it, expect } from 'vitest';
import Dot from '../../src/models/Dot.js';
import World from '../../src/models/World.js';
import * as dotMovement from '../../src/logic/dot-movement.js';

describe('dot-movement', () => {
  describe('calculateAvailableSteps', () => {
    it('returns all four directions when dot is in the center', () => {
      const dot = new Dot({ birthX: 200, birthY: 100 });
      const world = new World({ width: 450, height: 270 });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      expect(steps).toContain('n');
      expect(steps).toContain('s');
      expect(steps).toContain('e');
      expect(steps).toContain('w');
    });

    it('excludes north when at top wall', () => {
      const dot = new Dot({ birthX: 200, birthY: 1 });
      const world = new World({ width: 450, height: 270 });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      expect(steps).not.toContain('n');
      expect(steps).toContain('s');
    });

    it('excludes south when at bottom wall', () => {
      const dot = new Dot({ birthX: 200, birthY: 241 }); // 241 + 30 - 1 = 270, next south = 271 = y2
      const world = new World({ width: 450, height: 270 });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      expect(steps).not.toContain('s');
      expect(steps).toContain('n');
    });

    it('excludes east when at right wall', () => {
      const dot = new Dot({ birthX: 421, birthY: 100 }); // 421 + 30 - 1 = 450, next east = 451 = x2
      const world = new World({ width: 450, height: 270 });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      expect(steps).not.toContain('e');
      expect(steps).toContain('w');
    });

    it('excludes west when at left wall', () => {
      const dot = new Dot({ birthX: 1, birthY: 100 });
      const world = new World({ width: 450, height: 270 });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      expect(steps).not.toContain('w');
      expect(steps).toContain('e');
    });

    it('prioritizes steps based on polarity U and chirality R', () => {
      const dot = new Dot({ birthX: 200, birthY: 100 });
      const world = new World({ width: 450, height: 270, polarity: 'U', chirality: 'R' });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      // U/R prioritizes: n, e, s, w
      expect(steps[0]).toBe('n');
      expect(steps[1]).toBe('e');
    });

    it('prioritizes steps based on polarity D and chirality L', () => {
      const dot = new Dot({ birthX: 200, birthY: 100 });
      const world = new World({ width: 450, height: 270, polarity: 'D', chirality: 'L' });
      const steps = dotMovement.calculateAvailableSteps(dot, world);
      // D/L prioritizes: s, e, n, w
      expect(steps[0]).toBe('s');
      expect(steps[1]).toBe('e');
    });
  });

  describe('generateStepEndState', () => {
    it('generates correct state for north step', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 });
      const state = dotMovement.generateStepEndState(dot, 'n');
      expect(state.y1).toBe(70); // 100 - 30
      expect(state.y2).toBe(99); // 129 - 30
      expect(state.steps).toBe(1);
    });

    it('generates correct state for east step', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 });
      const state = dotMovement.generateStepEndState(dot, 'e');
      expect(state.x1).toBe(130); // 100 + 30
      expect(state.x2).toBe(159); // 129 + 30
      expect(state.steps).toBe(1);
    });

    it('returns empty object for null direction', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 });
      const state = dotMovement.generateStepEndState(dot, null);
      expect(state).toEqual({});
    });
  });

  describe('chooseNextStep', () => {
    it('takes a freedom step when no contracts or convictions', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 });
      dot.wake();
      const world = new World({ width: 450, height: 270 });

      const step = dotMovement.chooseNextStep(dot, world);
      expect(step.direction).not.toBeNull();
      expect(step.endState.events).toBe(1);
      expect(step.endState.currentDirection).toBe(step.direction);
    });

    it('honors an unsatisfied step contract', () => {
      const dot = new Dot({ birthX: 100, birthY: 100 });
      dot.stepContracts = {
        personal: {
          nextDirection: 'w',
          resumeDirection: 'n',
          resumeX: 100,
          resumeY: 100,
          intent: 'avoid',
          satisfied: false,
        },
        members: {},
      };
      const world = new World({ width: 450, height: 270 });

      const step = dotMovement.chooseNextStep(dot, world);
      expect(step.direction).toBe('w');
      expect(dot.stepContracts.personal.satisfied).toBe(true);
    });

    it('follows conviction step when contract is satisfied', () => {
      const dot = new Dot({ birthX: 100, birthY: 100, currentDirection: 'e' });
      dot.stepContracts = {
        personal: { satisfied: true },
        members: {},
      };
      dot.convictions = {
        step: {
          resumeDirection: 'n',
          resumeX: 100,
          resumeY: 100,
          satisfied: false,
        },
      };
      const world = new World({ width: 450, height: 270 });

      const step = dotMovement.chooseNextStep(dot, world);
      // Should try to resume course
      expect(step.direction).not.toBeNull();
    });
  });

  describe('performFreedomStep', () => {
    it('prefers to continue in the same direction', () => {
      const dot = new Dot({ birthX: 200, birthY: 100, currentDirection: 'e' });
      const world = new World({ width: 450, height: 270 });

      const step = dotMovement.performFreedomStep(dot, world);
      expect(step.direction).toBe('e');
    });

    it('records direction shift in memory', () => {
      // Dot at east wall, can only go n/s/w
      const dot = new Dot({ birthX: 421, birthY: 100, currentDirection: 'e' });
      const world = new World({ width: 450, height: 270 });

      const step = dotMovement.performFreedomStep(dot, world);
      expect(step.direction).not.toBe('e');
      expect(step.endState.moveShiftHistory.length).toBeGreaterThan(0);
    });
  });

  describe('isDotApproachingHeadOn', () => {
    it('detects north-south head-on', () => {
      const a = new Dot({ currentDirection: 'n' });
      const b = new Dot({ currentDirection: 's' });
      expect(dotMovement.isDotApproachingHeadOn(a, b)).toBe(true);
    });

    it('detects east-west head-on', () => {
      const a = new Dot({ currentDirection: 'e' });
      const b = new Dot({ currentDirection: 'w' });
      expect(dotMovement.isDotApproachingHeadOn(a, b)).toBe(true);
    });

    it('returns false for same direction', () => {
      const a = new Dot({ currentDirection: 'n' });
      const b = new Dot({ currentDirection: 'n' });
      expect(dotMovement.isDotApproachingHeadOn(a, b)).toBe(false);
    });

    it('returns false when either has no direction', () => {
      const a = new Dot({ currentDirection: 'n' });
      const b = new Dot();
      expect(dotMovement.isDotApproachingHeadOn(a, b)).toBe(false);
    });
  });

  describe('getNearbyDots', () => {
    it('finds dots within vision range', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100 });
      const near = new Dot({ id: 'near', birthX: 110, birthY: 100 });
      const far = new Dot({ id: 'far', birthX: 400, birthY: 400 });
      const others = { obs: observer, near, far };

      const result = dotMovement.getNearbyDots(observer, others, 2);
      expect(result.map(d => d.id)).toContain('near');
      expect(result.map(d => d.id)).not.toContain('far');
    });
  });

  describe('getOrthogonalDirections', () => {
    it('returns e/w for n/s', () => {
      expect(dotMovement.getOrthogonalDirections('n')).toEqual(['e', 'w']);
      expect(dotMovement.getOrthogonalDirections('s')).toEqual(['e', 'w']);
    });

    it('returns n/s for e/w', () => {
      expect(dotMovement.getOrthogonalDirections('e')).toEqual(['n', 's']);
      expect(dotMovement.getOrthogonalDirections('w')).toEqual(['n', 's']);
    });
  });
});
