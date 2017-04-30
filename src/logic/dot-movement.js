// -------------------------------------------------------------
// dot-movement.js
//
// Logic for Dot movement (steps).
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';

const debug = false;
const verbose = false;

// nextStep: {
//   direction: '',
//   endState: {},
// }
export function chooseNextStep(dot, world) {
  const nextStep = {
    endState: {},
  };

  if (dot.type === 'Dot' && world.type === 'DotWorld') {
    // Access movement memory...
    const shiftMemory = dot.moveShiftHistory.slice(0);

    // Check for active step contract with others...
    const stepContract = objectUtils.get(dot.stepContract, `members[${dot.id}]`, null);

    if (stepContract) {
      if (!stepContract.satisfied) {
        console.log(`====================>> "${dot.id}" will honor contract to move:`, stepContract.nextDirection);
      } else if (dot.currentDirection !== stepContract.resumeDirection) {
        console.log(`====================>> "${dot.id}" wants to resume direction:`, stepContract.resumeDirection);
      }
    }

    // Determine all available steps at this moment in the world...
    const steps = calculateAvailableSteps(dot, world);
    if (debug && verbose) console.log(`[movement] "${dot.id}" available steps =>`, steps);

    // If steps are available, decide which to take...
    if (steps.length > 0) {
      let direction = steps[0];
      const lastDirection = (shiftMemory.length > 0)
          ? shiftMemory[shiftMemory.length - 1]
          : null;

      // Try to continue in the same direction...
      if (objectUtils.includes(steps, lastDirection)) {
        direction = lastDirection;

      // Otherwise try to choose a fresh path...
      } else {
        if (lastDirection !== null) {
          const firstOption = direction;

          if (debug && verbose) {
            console.log('---------------------------------------------------------------------');
            console.log(`[movement] "${dot.id}" is deciding on a new direction: ${firstOption}`);
            console.log('        history:', shiftMemory);
            console.log('----------------------------------------------------------------------');
          }

          // If we recall taking this path, look for the freshest option...
          if (objectUtils.includes(shiftMemory, direction) && steps.length > 1) {
            let freshest = shiftMemory.length - 1;
            steps.forEach((move) => {
              const index = shiftMemory.lastIndexOf(move);
              if (index < freshest) {
                freshest = index;
                direction = move;
              }
            });
          }

          if (debug && verbose && direction !== firstOption) {
            console.log(`[movement] "${dot.id}" has selected ${direction} instead`);
          }
        } // end-if (lastDirection !== null)

        // Record shift...
        shiftMemory.push(direction);
        if (shiftMemory.length > this.memoryDepth) shiftMemory.shift(); // respect memory capacity
      } // end-if-else (objectUtils.includes(steps, lastDirection))

      // Generate step endState...
      const stepEndState = generateStepEndState(dot, direction);

      // Package step decision...
      nextStep.direction = direction;
      nextStep.endState.currentDirection = direction;
      nextStep.endState.moveShiftHistory = shiftMemory;
      Object.assign(nextStep.endState, stepEndState);
    } // end-if (steps.length > 0)

    // Increment events count...
    nextStep.endState.events = dot.events + 1;
  }

  return nextStep;
}

// --------------------------------------------------------------
// Returns an array of dots that are approaching the provided dot
// --------------------------------------------------------------
//
// ---------------------------
//  - X      <-- "approaching"   Event 0
//  - -
//  - O      <-- "observer"
// ---------------------------
// ---------------------------
//  - -                          Event 1
//  - X        (interaction)
//  O -
// ---------------------------
// ---------------------------
//  - -                          Event 2
//  O -
//  - X      <-- "leaving"
// ---------------------------
// -----------------------------------------------------------
export function getApproachingDots(/* dot = {}, others = {} */) {
  const approaching = [];
  return approaching;
}

// ---------------------------
//  - - X - -
//  - - - - -
//  - - O - -
//  - - - - -
//  - - - - -
// ---------------------------
export function isDotApproachingHeadOn(observer = {}, other = {}) {
  let headOn = false;

  if (observer.type === 'Dot' && other.type === 'Dot') {
    const observerDirection = observer.currentDirection;
    const otherDirection = other.currentDirection;

    if (observerDirection && otherDirection) {
      headOn = (
        (observerDirection === 'n' && otherDirection === 's') ||
        (observerDirection === 's' && otherDirection === 'n') ||
        (observerDirection === 'e' && otherDirection === 'w') ||
        (observerDirection === 'w' && otherDirection === 'e')
      );
    } // end-if (observerDirection && otherDirection)
  }

  return headOn;
}

export function isDotApproaching(/* observer = {}, other = {} */) {
}

// -----------------------------------------------------------
// Returns an array of dots that are nearby the provided dot
// -----------------------------------------------------------
//
// -----------------------------------------------------------
export function getNearbyDots(observer = {}, others = {}, visionDepth = 1) {
  const nearby = [];

  if (observer.type === 'Dot') {
    Object.keys(others).forEach((dotID) => {
      if (dotID !== observer.id) {
        const other = others[dotID];
        if (isDotInRange(observer, other, visionDepth)) nearby.push(other);
      }
    });
  }

  return nearby;
}

export function isDotInRange(observer = {}, other = {}, visionDepth = 1) {
  let result = false;

  if (observer.type === 'Dot' && other.type === 'Dot') {
    const distance = visionDepth * observer.width;
    const myNorthSight = (observer.y1 - 1) - distance;
    const myEastSight = (observer.x1 + 1) + distance;
    const mySouthSight = (observer.y2 + 1) + distance;
    const myWestSight = (observer.x2 - 1) - distance;

    if (other.x2 > myWestSight && other.x1 < myEastSight &&
        other.y2 > myNorthSight && other.y1 < mySouthSight) {
      result = true;
    }
  }

  return result;
}

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

    // if (nextDotNorth > worldNorth) steps.push('n');
    // if (nextDotEast < worldEast) steps.push('e');
    // if (nextDotSouth < worldSouth) steps.push('s');
    // if (nextDotWest > worldWest) steps.push('w');

    if (nextDotNorth > worldNorth) steps.push('n');
    if (nextDotSouth < worldSouth) steps.push('s');
    if (nextDotEast < worldEast) steps.push('e');
    if (nextDotWest > worldWest) steps.push('w');
  }

  return steps;
}

export function getOrthogonalDirections(origin) {
  return (origin === 'n' || origin === 's')
      ? ['e', 'w']
      : ['n', 's'];
}

export function generateStepEndState(dot = {}, direction) {
  if (dot.type === 'Dot') {
    const step = dot.width;
    const steps = dot.steps + 1; // increment steps count

    switch (direction) {
      case 'n': {
        const newY1 = dot.y1 - step;
        const newY2 = dot.y2 - step;
        const newFromY = dot.fromY - step;
        return { steps, y1: newY1, y2: newY2, fromY: newFromY };
      }
      case 's': {
        const newY1 = dot.y1 + step;
        const newY2 = dot.y2 + step;
        const newFromY = dot.fromY + step;
        return { steps, y1: newY1, y2: newY2, fromY: newFromY };
      }
      case 'e': {
        const newX1 = dot.x1 + step;
        const newX2 = dot.x2 + step;
        const newFromX = dot.fromX + step;
        return { steps, x1: newX1, x2: newX2, fromX: newFromX };
      }
      case 'w': {
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
