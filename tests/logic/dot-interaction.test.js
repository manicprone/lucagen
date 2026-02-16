import { describe, it, expect } from 'vitest';
import Dot from '../../src/models/Dot.js';
import World from '../../src/models/World.js';
import * as dotInteraction from '../../src/logic/dot-interaction.js';

describe('dot-interaction', () => {
  describe('negotiateStepContract', () => {
    it('creates avoid contract between two dots', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100, currentDirection: 'e' });
      observer.stepContracts = { members: {} };
      const other = new Dot({ id: 'other', birthX: 140, birthY: 100, currentDirection: 'e' });
      other.stepContracts = { members: {} };
      const world = new World({ width: 450, height: 270 });

      const contract = dotInteraction.negotiateStepContract(observer, other, world);
      expect(contract.personal.intent).toBe('avoid');
      expect(contract.members[other.id].intent).toBe('avoid');
    });

    it('creates collision avoidance contract for head-on dots', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100, currentDirection: 'e' });
      observer.stepContracts = { members: {} };
      const other = new Dot({ id: 'other', birthX: 160, birthY: 100, currentDirection: 'w' });
      other.stepContracts = { members: {} };
      const world = new World({ width: 450, height: 270 });

      const contract = dotInteraction.negotiateStepContract(observer, other, world);
      expect(contract.personal.intent).toBe('avoid');
      expect(contract.personal.satisfied).toBe(false);
      // Should have a lateral nextDirection (n or s)
      expect(['n', 's']).toContain(contract.personal.nextDirection);
      expect(contract.personal.resumeDirection).toBe('e');
    });

    it('adopts existing contract from other dot', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100 });
      observer.stepContracts = { members: {} };
      const other = new Dot({ id: 'other', birthX: 140, birthY: 100 });
      other.stepContracts = {
        personal: { nextDirection: 'w', intent: 'avoid', satisfied: false },
        members: {
          obs: { nextDirection: 'e', intent: 'avoid', satisfied: false },
        },
      };

      const world = new World({ width: 450, height: 270 });
      const contract = dotInteraction.negotiateStepContract(observer, other, world);

      expect(contract.personal.nextDirection).toBe('e');
      expect(contract.members.other).toEqual(other.stepContracts.personal);
    });

    it('skips negotiation if contract already on record', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100 });
      observer.stepContracts = {
        members: { other: { intent: 'avoid' } },
      };
      const other = new Dot({ id: 'other', birthX: 140, birthY: 100 });
      other.stepContracts = { members: {} };
      const world = new World({ width: 450, height: 270 });

      const contract = dotInteraction.negotiateStepContract(observer, other, world);
      expect(Object.keys(contract)).toHaveLength(0); // empty
    });
  });

  describe('purgeMemberStepContracts', () => {
    it('keeps contracts for nearby dots only', () => {
      const observer = new Dot({ id: 'obs' });
      observer.stepContracts = {
        members: {
          nearby: { intent: 'avoid' },
          gone: { intent: 'avoid' },
        },
      };

      const nearby = new Dot({ id: 'nearby' });
      const result = dotInteraction.purgeMemberStepContracts(observer, [nearby]);

      expect(result.nearby).toBeDefined();
      expect(result.gone).toBeUndefined();
    });

    it('returns empty when no others are nearby', () => {
      const observer = new Dot({ id: 'obs' });
      observer.stepContracts = {
        members: { gone: { intent: 'avoid' } },
      };

      const result = dotInteraction.purgeMemberStepContracts(observer, []);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('interactWithOthers', () => {
    it('returns interactions object', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100 });
      observer.stepContracts = {};
      const world = new World({ width: 450, height: 270 });
      world.addDot(observer);

      const result = dotInteraction.interactWithOthers(observer, world);
      expect(result).toHaveProperty('endState');
    });

    it('creates step contracts when dots are nearby', () => {
      const observer = new Dot({ id: 'obs', birthX: 100, birthY: 100, currentDirection: 'e' });
      observer.stepContracts = { members: {} };
      const other = new Dot({ id: 'other', birthX: 110, birthY: 100, currentDirection: 'w' });
      other.stepContracts = { members: {} };

      const world = new World({ width: 450, height: 270 });
      world.addDot(observer);
      world.addDot(other);

      dotInteraction.interactWithOthers(observer, world);
      expect(observer.stepContracts.members).toBeDefined();
    });
  });

  describe('stubs', () => {
    it('isWillingToInteractWithDot returns false', () => {
      expect(dotInteraction.isWillingToInteractWithDot()).toBe(false);
    });

    it('performInteraction returns empty end states', () => {
      const result = dotInteraction.performInteraction();
      expect(result.initiatorEndState).toEqual({});
      expect(result.recipientEndState).toEqual({});
    });
  });
});
