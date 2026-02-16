// -------------------------------------------------------------
// dot-movement-ui.js
//
// Logic for Dot movement UI actions.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';

// -----------------------------------------------------------
// Generates a CSS3-compatible spec for transformations
// -----------------------------------------------------------
// The "moveInfo" object:
//
// direction: <String>  => The cardinal direction of the move.
//                         (supported: 'n', 'e', 's', 'w')
//
// distance: <Number>   => The pixel value for the desired
//                         transformation distance.
// -----------------------------------------------------------
export function generateStepInstruction(moveInfo = {}) {
  const direction = objectUtils.get(moveInfo, 'direction', 'noop');
  const distance = objectUtils.get(moveInfo, 'distance', null);

  const stepInstruction = {};

  if (distance !== null && !isNaN(distance)) {
    switch (direction) {
      case 'n':
      case 'north': {
        stepInstruction.translateY = `${distance}px`;
        return stepInstruction;
      }
      case 's':
      case 'south': {
        stepInstruction.translateY = `${distance}px`;
        return stepInstruction;
      }
      case 'e':
      case 'east': {
        stepInstruction.translateX = `${distance}px`;
        return stepInstruction;
      }
      case 'w':
      case 'west': {
        stepInstruction.translateX = `${distance}px`;
        return stepInstruction;
      }
      default: {
        return stepInstruction;
      }
    } // end-switch
  } // end-if (target && !NaN(target))

  return stepInstruction;
}
