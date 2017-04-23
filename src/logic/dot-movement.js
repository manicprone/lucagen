// -------------------------------------------------------------
// dot-movement.js
//
// Logic for Dot movement (steps).
// -------------------------------------------------------------
// const debug = false;
// const verbose = false;

// TODO: Apply nearbyDots to calculation (to avoid collisions) !!!
//       (using the observer's visionDepth)
// TODO: Idea => look at history of nearbyDots (2 or 3 depth)
//       so observer can predict their next direction !!!
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
    if (nextDotNorth > worldNorth) steps.push('n');

    // East...
    if (nextDotEast < worldEast) steps.push('e');

    // South...
    if (nextDotSouth < worldSouth) steps.push('s');

    // West...
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
