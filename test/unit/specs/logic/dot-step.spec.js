import chai from 'chai';
import * as dotStep from '../../../../src/logic/dot-step';

const expect = chai.expect;

describe('dot-step', () => {
  // -----------------------------------
  // Testing: calculateAvailableSteps...
  // -----------------------------------
  describe('calculateAvailableSteps', () => {
    it('should return an empty array when no parameters are provided', () => {
      const steps = dotStep.calculateAvailableSteps();

      expect(steps)
        .to.be.an('array')
        .and.to.have.length(0);
    });
  }); // end-calculateAvailableSteps
});
