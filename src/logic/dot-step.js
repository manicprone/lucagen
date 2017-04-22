// -------------------------------------------------------------
// dot-step.js
//
// Logic for Dot steps.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';

const debug = false;
const verbose = false;

// -----------------------------------------------------------
// Returns an array of available steps
// -----------------------------------------------------------
export function calculateAvailableSteps(dot = {}, world = {}) {
  const steps = [];
  const step = dot.width;

  if (dot.type === 'Dot' && world.type === 'DotWorld') {
    const nextDotEast = dot.x2 + step;
    const nextDotWest = dot.x1 - step;
    const nextDotNorth = dot.y1 - step;
    const nextDotSouth = dot.y2 + step;

    const worldEast = world.x2;
    const worldWest = world.x1;
    const worldNorth = world.y1;
    const worldSouth = world.y2;

    // North...
    if (debug && verbose) console.log(`[movement] [${dot.id}] is dotNorth ${dot.y1} - ${step} > worldNorth ${worldNorth}?`);
    if (nextDotNorth > worldNorth) steps.push('n');

    // East...
    if (debug && verbose) console.log(`[movement] [${dot.id}] is dotEast ${dot.x2} + ${step} < worldEast ${worldEast}?`);
    if (nextDotEast < worldEast) steps.push('e');

    // South...
    if (debug && verbose) console.log(`[movement] [${dot.id}] is dotSouth ${dot.y2} + ${step} < worldSouth ${worldSouth}?`);
    if (nextDotSouth < worldSouth) steps.push('s');

    // West...
    if (debug && verbose) console.log(`[movement] [${dot.id}] is dotWest ${dot.x1} - ${step} > worldWest ${worldWest}?`);
    if (nextDotWest > worldWest) steps.push('w');
  }

  return steps;
}

export function generateStepEndState(dot = {}, direction) {
  if (dot.type === 'Dot') {
    const step = dot.width;
    const steps = dot.steps + 1; // increment steps count

    switch (direction) {
      case 'n':
      case 'north': {
        const newY1 = dot.y1 - step;
        const newY2 = dot.y2 - step;
        const newFromY = dot.fromY - step;
        return { steps, y1: newY1, y2: newY2, fromY: newFromY };
      }
      case 's':
      case 'south': {
        const newY1 = dot.y1 + step;
        const newY2 = dot.y2 + step;
        const newFromY = dot.fromY + step;
        return { steps, y1: newY1, y2: newY2, fromY: newFromY };
      }
      case 'e':
      case 'east': {
        const newX1 = dot.x1 + step;
        const newX2 = dot.x2 + step;
        const newFromX = dot.fromX + step;
        return { steps, x1: newX1, x2: newX2, fromX: newFromX };
      }
      case 'w':
      case 'west': {
        const newX1 = dot.x1 - step;
        const newX2 = dot.x2 - step;
        const newFromX = dot.fromX - step;
        return { steps, x1: newX1, x2: newX2, fromX: newFromX };
      }
      default: return {};
    } // end-switch
  }

  return {};
}

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
