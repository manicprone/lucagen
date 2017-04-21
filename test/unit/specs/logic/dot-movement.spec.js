import chai from 'chai';
import World from '../../../../src/models/World';
import Dot from '../../../../src/models/Dot';
import * as dotMovement from '../../../../src/logic/dot-movement';

const expect = chai.expect;

const worlds = {};
const observers = {};
const others = {};

describe.only('dot-movement', () => {
  before(() => {
    // --------------------------------
    // Contruct world of 7 x 7 steps...
    // --------------------------------
    const step = 9;
    const rows = 7;
    const cols = 7;

    const worldData = {
      name: 'Lonely World',
      width: step * cols,
      height: step * rows,
    };
    worlds['center-lonely'] = new World(worldData); // observer in center, no others
    worlds['center-full'] = new World(worldData); // observer in center, others in all remaining
    worlds['cornerSW'] = new World(worldData); // observer in SW corner, others in all remaining

    // -----------------------
    // Fill world with dots...
    // -----------------------
    for (let r = 0; r < rows; r++) {
      const y1 = (r === 0) ? 1 : (r * step) + 1;
      for (let c = 0; c < cols; c++) {
        const x1 = (c === 0) ? 1 : (c * step) + 1;
        if (x1 === 28 && y1 === 28) {
          // Generate observer at center of world (range of 3 steps in all directions)
          const observerData = {
            id: 'observer-center',
            name: 'Center Observer',
            birthX: x1,
            birthY: y1,
          };
          observers['observer-center'] = new Dot(observerData);
          worlds['center-lonely'].addDot(observers['observer-center']);
          worlds['center-full'].addDot(observers['observer-center']);
        } else {
          // Generate other dots for all remaining steps...
          const id = `r-${r}_c-${c}`;
          const name = `R-${r}_C-${c}`;
          const otherDotData = { id, name, birthX: x1, birthY: y1 };
          others[id] = new Dot(otherDotData);
          worlds['center-full'].addDot(others[id]);
        }
      } // end-for (cols)
    } // end-for (rows)

    // console.log(`[TEST] other dots created (${Object.keys(others).length})`);
    // Object.keys(others).forEach((dotID) => {
    //   const dot = others[dotID];
    //   console.log(`[${dot.birthX}, ${dot.birthY}]`);
    // });
  });

  // ------------------------
  // Testing: isDotInRange...
  // ------------------------
  describe('isDotInRange', () => {
    it('should return "false" when invalid parameters are provided', () => {
      const fake = { id: 1, name: 'Fake Dot' };
      const result = dotMovement.isDotInRange(fake, {});

      expect(result).to.equal(false);
    });

    it('should return "true" when a Dot is in visual range', () => {
      const observer = observers['observer-center'];
      let inRangeCount = 0;

      // visionDepth = 1
      Object.keys(others).forEach((dotID) => {
        const dot = others[dotID];
        const result = dotMovement.isDotInRange(observer, dot);
        if (result) inRangeCount += 1;
      });
      expect(inRangeCount).to.equal(8);

      // visionDepth = 2
      observer.visionDepth = 2;
      inRangeCount = 0;
      Object.keys(others).forEach((dotID) => {
        const dot = others[dotID];
        const result = dotMovement.isDotInRange(observer, dot);
        if (result) inRangeCount += 1;
      });
      expect(inRangeCount).to.equal(24);

      // visionDepth = 3
      observer.visionDepth = 3;
      inRangeCount = 0;
      Object.keys(others).forEach((dotID) => {
        const dot = others[dotID];
        const result = dotMovement.isDotInRange(observer, dot);
        if (result) inRangeCount += 1;
      });
      expect(inRangeCount).to.equal(48);
    });
  }); // end-isDotInRange

  // -------------------------
  // Testing: getNearbyDots...
  // -------------------------
  describe('getNearbyDots', () => {
    it('should return an empty array when no parameters are provided', () => {
      const nearby = dotMovement.getNearbyDots();

      expect(nearby)
        .to.be.an('array')
        .and.to.have.length(0);
    });

    it('should return an empty array when no other dots exist in the world', () => {
      const world = worlds['center-lonely'];
      const observer = observers['observer-center'];
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
