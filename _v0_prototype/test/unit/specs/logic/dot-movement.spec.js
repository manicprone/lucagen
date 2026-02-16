import chai from 'chai';
import World from '../../../../src/models/World';
import Dot from '../../../../src/models/Dot';
import * as dotMovement from '../../../../src/logic/dot-movement';

const expect = chai.expect;

const worlds = {};
const observers = {};
const others = {};

describe('dot-movement', () => {
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
        const result = dotMovement.isDotInRange(observer, dot, 1);
        if (result) inRangeCount += 1;
      });
      expect(inRangeCount).to.equal(8);

      // visionDepth = 2
      inRangeCount = 0;
      Object.keys(others).forEach((dotID) => {
        const dot = others[dotID];
        const result = dotMovement.isDotInRange(observer, dot, 2);
        if (result) inRangeCount += 1;
      });
      expect(inRangeCount).to.equal(24);

      // visionDepth = 3
      inRangeCount = 0;
      Object.keys(others).forEach((dotID) => {
        const dot = others[dotID];
        const result = dotMovement.isDotInRange(observer, dot, 3);
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
      const world = worlds['center-lonely']; // no other dots
      const observer = observers['observer-center'];

      // Verify dot count in world...
      expect(world.dots.length).to.equal(1);

      // visionDepth = 3 (entire world space)
      const nearby = dotMovement.getNearbyDots(observer, world.dotRegistry, 3);

      expect(nearby)
        .to.be.an('array')
        .and.to.have.length(0);
    });

    it('should return an array of dots that are in visual range of the observer', () => {
      const world = worlds['center-full']; // full of dots, observer in center
      const observer = observers['observer-center'];

      // Verify dot count in world...
      expect(world.dots.length).to.equal(49);

      // visionDepth = 1
      const nearbyWithDepth1 = dotMovement.getNearbyDots(observer, world.dotRegistry, 1);
      expect(nearbyWithDepth1)
        .to.be.an('array')
        .and.to.have.length(8);
      expect(nearbyWithDepth1[0].type).to.equal('Dot');

      // visionDepth = 2
      const nearbyWithDepth2 = dotMovement.getNearbyDots(observer, world.dotRegistry, 2);
      expect(nearbyWithDepth2)
        .to.be.an('array')
        .and.to.have.length(24);
      expect(nearbyWithDepth2[23].type).to.equal('Dot');

      // visionDepth = 3
      const nearbyWithDepth3 = dotMovement.getNearbyDots(observer, world.dotRegistry, 3);
      expect(nearbyWithDepth3)
        .to.be.an('array')
        .and.to.have.length(48);
      expect(nearbyWithDepth3[47].type).to.equal('Dot');
    });
  }); // end-getNearbyDots
});
