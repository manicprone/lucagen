// -------------------------------------------------------------
// dot-world-utils.js
//
// Provides helper functions for the Dot World logic.
// -------------------------------------------------------------
import objectUtils from './object-utils';

const debug = false;
const verbose = false;
const step = 10; // TODO: Move this to World, Dot, or just a config !?!?!?

// Basically, just ensure the Dot will not hit a wall.
// e.g. ['n', 'e', 's', 'w'] (ordered by priority)
//      priority will be leveraged when other factors
//      are considered.
export function determineAvailableMoves(dot, world) {
  const moves = [];

  if (dot && dot.type === 'Dot' && world && world.type === 'DotWorld') {
    const nextDotEast = dot.x2 + step;
    const nextDotWest = dot.x1 - step;
    const nextDotNorth = dot.y1 - step;
    const nextDotSouth = dot.y2 + step;

    const worldEast = world.x2;
    const worldWest = world.x1;
    const worldNorth = world.y1;
    const worldSouth = world.y2;

    // North...
    if (debug && verbose) console.log(`[UTILS] is dotNorth ${dot.y1} - ${step} >= worldNorth ${worldNorth}?`);
    if (nextDotNorth >= worldNorth) moves.push('n');

    // East...
    if (debug && verbose) console.log(`[UTILS] is dotEast ${dot.x2} + ${step} <= worldEast ${worldEast}?`);
    if (nextDotEast <= worldEast) moves.push('e');

    // South...
    if (debug && verbose) console.log(`[UTILS] is dotSouth ${dot.y2} + ${step} <= worldSouth ${worldSouth}?`);
    if (nextDotSouth <= worldSouth) moves.push('s');

    // West...
    if (debug && verbose) console.log(`[UTILS] is dotWest ${dot.x1} - ${step} >= worldWest ${worldWest}?`);
    if (nextDotWest >= worldWest) moves.push('w');
  }

  return moves;
}

export function generateMoveEndState(dot, direction) {
  if (dot && dot.type === 'Dot') {
    switch (direction) {
      case 'n':
      case 'north': {
        const newY1 = dot.y1 - step;
        const newY2 = dot.y2 - step;
        const newFromY = dot.fromY - step;
        return { y1: newY1, y2: newY2, fromY: newFromY };
      }
      case 's':
      case 'south': {
        const newY1 = dot.y1 + step;
        const newY2 = dot.y2 + step;
        const newFromY = dot.fromY + step;
        return { y1: newY1, y2: newY2, fromY: newFromY };
      }
      case 'e':
      case 'east': {
        const newX1 = dot.x1 + step;
        const newX2 = dot.x2 + step;
        const newFromX = dot.fromX + step;
        return { x1: newX1, x2: newX2, fromX: newFromX };
      }
      case 'w':
      case 'west': {
        const newX1 = dot.x1 - step;
        const newX2 = dot.x2 - step;
        const newFromX = dot.fromX - step;
        return { x1: newX1, x2: newX2, fromX: newFromX };
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
// target: <Number>     => The pixel value for the desired
//                         transformation distance.
// -----------------------------------------------------------
export function generateMoveInstruction(moveInfo) {
  const direction = objectUtils.get(moveInfo, 'direction', 'noop');
  const target = objectUtils.get(moveInfo, 'target', null);

  const moveInstruction = {};

  if (target && !isNaN(target)) {
    switch (direction) {
      case 'n':
      case 'north': {
        moveInstruction.translateY = `${target}px`;
        return moveInstruction;
      }
      case 's':
      case 'south': {
        moveInstruction.translateY = `${target}px`;
        return moveInstruction;
      }
      case 'e':
      case 'east': {
        moveInstruction.translateX = `${target}px`;
        return moveInstruction;
      }
      case 'w':
      case 'west': {
        moveInstruction.translateX = `${target}px`;
        return moveInstruction;
      }
      default: {
        return moveInstruction;
      }
    } // end-switch
  } // end-if (target && !NaN(target))

  return moveInstruction;
}
