// -------------------------------------------------------------
// dot-movement.js
//
// Logic for Dot movement.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';

const debug = true;
const verbose = true;

// Basically, just ensure the Dot will not hit a wall.
// e.g. ['n', 'e', 's', 'w'] (ordered by priority)
//      priority will be leveraged when other factors
//      are considered.
export function determineAvailableMoves(dot = {}, world = {}) {
  const moves = [];
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
    if (debug && verbose) console.log(`[movement] is dotNorth ${dot.y1} - ${step} >= worldNorth ${worldNorth}?`);
    if (nextDotNorth >= worldNorth) moves.push('n');

    // East...
    if (debug && verbose) console.log(`[movement] is dotEast ${dot.x2} + ${step} <= worldEast ${worldEast}?`);
    if (nextDotEast <= worldEast) moves.push('e');

    // South...
    if (debug && verbose) console.log(`[movement] is dotSouth ${dot.y2} + ${step} <= worldSouth ${worldSouth}?`);
    if (nextDotSouth <= worldSouth) moves.push('s');

    // West...
    if (debug && verbose) console.log(`[movement] is dotWest ${dot.x1} - ${step} >= worldWest ${worldWest}?`);
    if (nextDotWest >= worldWest) moves.push('w');
  }

  return moves;
}

export function generateMoveEndState(dot = {}, direction) {
  if (dot.type === 'Dot') {
    const step = dot.width;

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
// distance: <Number>   => The pixel value for the desired
//                         transformation distance.
// -----------------------------------------------------------
export function generateMoveInstruction(moveInfo = {}) {
  const direction = objectUtils.get(moveInfo, 'direction', 'noop');
  const distance = objectUtils.get(moveInfo, 'distance', null);

  const moveInstruction = {};

  if (distance !== null && !isNaN(distance)) {
    switch (direction) {
      case 'n':
      case 'north': {
        moveInstruction.translateY = `${distance}px`;
        return moveInstruction;
      }
      case 's':
      case 'south': {
        moveInstruction.translateY = `${distance}px`;
        return moveInstruction;
      }
      case 'e':
      case 'east': {
        moveInstruction.translateX = `${distance}px`;
        return moveInstruction;
      }
      case 'w':
      case 'west': {
        moveInstruction.translateX = `${distance}px`;
        return moveInstruction;
      }
      default: {
        return moveInstruction;
      }
    } // end-switch
  } // end-if (target && !NaN(target))

  return moveInstruction;
}

// -----------------------------------------------------------
// Returns an array of dots that are nearby the provided dot.
// -----------------------------------------------------------
//
// -----------------------------------------------------------
export function getNearbyDots(dot = {}, world = {}) {
  const nearby = [];

  if (dot.type === 'Dot' && world.type === 'DotWorld') {
    const registry = world.dotRegistry;

    Object.keys(registry).forEach((dotID) => {
      if (dotID !== dot.id) {
        const other = registry[dotID];
        if (debug && verbose) console.log('[movement] scoping other dot =>', other);
        if (isDotInRange(dot, other)) nearby.push(other);
      }
    });
  }

  return nearby;
}

export function isDotInRange(/* observer = {}, other = {} */) {
  return false;
}
