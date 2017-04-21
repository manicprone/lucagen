import chai from 'chai';
import World from '../../../../src/models/World';
import Dot from '../../../../src/models/Dot';
import * as dotMovement from '../../../../src/logic/dot-movement';

const expect = chai.expect;

let world = null;
let observers = {};
// let others = {};

describe.only('dot-movement', () => {
  // ------------------------
  // Testing: isDotInRange...
  // ------------------------
  describe('isDotInRange', () => {
    before(() => {
      // -------------------
      // Clear registries...
      // -------------------
      observers = {};
      // others = {};

      // --------------------------------
      // Contruct world of 7 x 7 steps...
      // --------------------------------
      const worldData = {
        name: 'Test World',
        width: 63,
        height: 63,
      };
      world = new World(worldData);

      // -------------------------------
      // Populate observers for tests...
      // -------------------------------
      // Dead center of world (range of 3 steps in all directions)
      const centerObserverData = {
        id: 'observer-center',
        name: 'Center Observer',
        birthX: 28,
        birthY: 28,
        visionDepth: 1,
      };
      observers['observer-center'] = new Dot(centerObserverData);

      // ----------------------------
      // Populate others for tests...
      // ----------------------------
    });

    it('should return "false" when invalid parameters are provided', () => {
      const fake = { id: 1, name: 'Fake Dot' };
      const result = dotMovement.isDotInRange(fake, {});

      expect(result).to.equal(false);
    });

    it('should return "true" when a Dot is in visual range (visionDepth = 1)', () => {
      // Adjacent North
      const adjacentNorthData = {
        id: 'north-1',
        name: 'Adjacent North',
        birthX: 28,
        birthY: 19,
      };
      const adjacentNorth = new Dot(adjacentNorthData);

      // Two Steps North...
      const twoNorthData = {
        id: 'north-2',
        name: 'Two North',
        birthX: 28,
        birthY: 10,
      };
      const twoNorth = new Dot(twoNorthData);

      // Adjacent East...
      const adjacentEastData = {
        id: 'east-1',
        name: 'Adjacent East',
        width: 9,
        height: 9,
        birthX: 37,
        birthY: 28,
      };
      const adjacentEast = new Dot(adjacentEastData);

      // Two Steps East...
      const twoEastData = {
        id: 'east-2',
        name: 'Two East',
        width: 9,
        height: 9,
        birthX: 46,
        birthY: 28,
      };
      const twoEast = new Dot(twoEastData);

      // Adjacent South...
      const adjacentSouthData = {
        id: 'south-1',
        name: 'Adjacent South',
        width: 9,
        height: 9,
        birthX: 28,
        birthY: 37,
      };
      const adjacentSouth = new Dot(adjacentSouthData);

      // Two Steps South...
      const twoSouthData = {
        id: 'south-2',
        name: 'Two South',
        width: 9,
        height: 9,
        birthX: 28,
        birthY: 46,
      };
      const twoSouth = new Dot(twoSouthData);

      // Adjacent West...
      const adjacentWestData = {
        id: 'west-1',
        name: 'Adjacent West',
        width: 9,
        height: 9,
        birthX: 19,
        birthY: 28,
      };
      const adjacentWest = new Dot(adjacentWestData);

      // Two Steps West...
      const twoWestData = {
        id: 'west-2',
        name: 'Two West',
        width: 9,
        height: 9,
        birthX: 10,
        birthY: 28,
      };
      const twoWest = new Dot(twoWestData);

      const observer = observers['observer-center'];
      const isAdjacentNorth = dotMovement.isDotInRange(observer, adjacentNorth);
      const isTwoNorth = dotMovement.isDotInRange(observer, twoNorth);
      const isAdjacentEast = dotMovement.isDotInRange(observer, adjacentEast);
      const isTwoEast = dotMovement.isDotInRange(observer, twoEast);
      const isAdjacentSouth = dotMovement.isDotInRange(observer, adjacentSouth);
      const isTwoSouth = dotMovement.isDotInRange(observer, twoSouth);
      const isAdjacentWest = dotMovement.isDotInRange(observer, adjacentWest);
      const isTwoWest = dotMovement.isDotInRange(observer, twoWest);
      expect(isAdjacentNorth).to.equal(true);
      expect(isTwoNorth).to.equal(false);
      expect(isAdjacentEast).to.equal(true);
      expect(isTwoEast).to.equal(false);
      expect(isAdjacentSouth).to.equal(true);
      expect(isTwoSouth).to.equal(false);
      expect(isAdjacentWest).to.equal(true);
      expect(isTwoWest).to.equal(false);
    });
  }); // end-isDotInRange

  // -------------------------
  // Testing: getNearbyDots...
  // -------------------------
  describe('getNearbyDots', () => {
    before(() => {
      // -------------------
      // Clear registries...
      // -------------------
      observers = {};
      // others = {};

      // --------------------------------
      // Contruct world of 7 x 7 steps...
      // --------------------------------
      const worldData = {
        name: 'Test World',
        width: 63,
        height: 63,
      };
      world = new World(worldData);

      // -------------------------------
      // Populate observers for tests...
      // -------------------------------
      // NW corner of world
      const cornerNWObserverData = {
        id: 'observer-nw',
        name: 'NW Corner Observer',
        birthX: 1,
        birthY: 1,
        visionDepth: 1,
      };
      observers['observer-nw'] = new Dot(cornerNWObserverData);

      // ------------------------
      // Add observer to world...
      // ------------------------
      world.addDot(observers['observer-nw']);
    });

    it('should return an empty array when no parameters are provided', () => {
      const nearby = dotMovement.getNearbyDots();

      expect(nearby)
        .to.be.an('array')
        .and.to.have.length(0);
    });

    it('should return an empty array when no other dots exist in the world', () => {
      const observer = observers['observer-nw'];
      const nearby = dotMovement.getNearbyDots(observer, world);

      expect(nearby)
        .to.be.an('array')
        .and.to.have.length(0);
    });
  }); // end-getNearbyDots

  // -----------------------------------
  // Testing: determineAvailableMoves...
  // -----------------------------------
  describe('determineAvailableMoves', () => {
    it('should return an empty array when no parameters are provided', () => {
      const moves = dotMovement.determineAvailableMoves();

      expect(moves)
        .to.be.an('array')
        .and.to.have.length(0);
    });
  }); // end-determineAvailableMoves
});
