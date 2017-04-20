import chai from 'chai';
import World from '../../../../src/models/World';
import Dot from '../../../../src/models/Dot';
import * as dotMovement from '../../../../src/logic/dot-movement';

const expect = chai.expect;

let world = null;
let observer = null;

describe('  -------------------------------- dot-movement', () => {
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

    // it('should return the Bookshelf-compatible spec for a single order value (positive/ascending)', () => {
    //   const fieldValue = 'title';
    //   const orderBy = ApiUtils.buildOrderBy(fieldValue);
    //
    //   expect(orderBy)
    //     .to.be.an('array')
    //     .and.to.have.length(1);
    //
    //   expect(orderBy[0])
    //     .to.contain({
    //       col: 'title',
    //       order: 'asc',
    //     });
    // });
  }); // end-determineAvailableMoves

  // -------------------------
  // Testing: getNearbyDots...
  // -------------------------
  describe.only('getNearbyDots', () => {
    before(() => {
      const worldData = {
        name: 'Test World',
        width: 450,
        height: 270,
      };

      const observerData = {
        id: 'observer',
        name: 'Observer',
        width: 9,
        height: 9,
        birthX: 1,
        birthY: 1,
        memoryDepth: 5,
      };

      world = new World(worldData);
      observer = new Dot(observerData);
      world.addDot(observer);
    });

    it('should return an empty array when no parameters are provided', () => {
      const nearby = dotMovement.getNearbyDots();

      expect(nearby)
        .to.be.an('array')
        .and.to.have.length(0);
    });

    it('should return an empty array when no other dots exist in the world', () => {
      const nearby = dotMovement.getNearbyDots(observer, world);

      expect(nearby)
        .to.be.an('array')
        .and.to.have.length(0);
    });
  }); // end-getNearbyDots
});
