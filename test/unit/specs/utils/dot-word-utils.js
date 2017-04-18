import chai from 'chai';
import * as dotWorldUtils from '../../../../src/utils/dot-world-utils';

const expect = chai.expect;

describe('dot-world-utils', () => {
  // -----------------------------------
  // Testing: determineAvailableMoves...
  // -----------------------------------
  describe('determineAvailableMoves', () => {
    it('should run', () => {
      const moves = dotWorldUtils.determineAvailableMoves();

      expect(moves)
        .to.be.an('array')
        .and.to.have.length(1);
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
});
