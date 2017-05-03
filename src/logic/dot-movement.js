// -------------------------------------------------------------
// dot-movement.js
//
// Logic for Dot movement (steps).
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';
import * as dotMotivation from './dot-motivation';

const debugChooseNextStep = true;

// nextStep: {
//   direction: '',
//   endState: {},
// }
export function chooseNextStep(dot = {}, world = {}) {
  const nextStep = {
    direction: null,
    endState: {},
  };

  // Check for active step contract with others...
  const stepContract = (objectUtils.has(dot.stepContracts.personal, 'satisfied'))
      ? dot.stepContracts.personal
      : null;

  // ----------------------------------------
  // Honor agreements made with other Dots...
  // ----------------------------------------
  if (stepContract && !stepContract.satisfied) {
    if (debugChooseNextStep) console.log(`[movement] [chooseNextStep] "${dot.id}" has an unsatisfied step contract:`, stepContract);

    // Accept agreed direction, satisfy contract...
    const nextDirection = stepContract.nextDirection;
    Object.assign(stepContract, { satisfied: true });

    // If planning to return to a direction, create a conviction...
    if (objectUtils.has(stepContract, 'resumeDirection')) {
      if (debugChooseNextStep) console.log(`[movement] [chooseNextStep] "${dot.id}" wants to resume direction:`, stepContract.resumeDirection);
      dotMotivation.addStepConviction(dot, stepContract);
    }

    // Package step decision...
    nextStep.direction = nextDirection;
    nextStep.endState.currentDirection = nextDirection;
    Object.assign(nextStep.endState, generateStepEndState(dot, nextDirection));

  // ---------------------------------------------
  // Otherwise, we are free to choose next step...
  // ---------------------------------------------
  } else {
    // Check for step conviction...
    const stepConviction = objectUtils.get(dot.convictions, 'step', null);
    if (stepConviction && !stepConviction.satisfied) {
      if (debugChooseNextStep) console.log(`[movement] [chooseNextStep] "${dot.id}" has an unsatisfied step conviction:`, stepConviction);

      const convictionStep = performConvictionStep(dot, world, stepConviction);
      Object.assign(nextStep, convictionStep);

    // Otherwise, take a freedom step...
    } else {
      if (debugChooseNextStep) console.log(`[movement] [chooseNextStep] "${dot.id}" is free to wander`);

      const freedomStep = performFreedomStep(dot, world);
      Object.assign(nextStep, freedomStep);
    }
  }

  // Increment events count...
  nextStep.endState.events = dot.events + 1;

  return nextStep;
}

// export function performContractStep(dot = {}, world = {}, stepContract = {}) {
//   const nextStep = {
//     direction: null,
//     endState: {},
//   };
//
//   return nextStep;
// }

const debugConvictionStep = true;
const verboseConvictionStep = true;

export function performConvictionStep(dot = {}, world = {}, stepConviction = {}) {
  const nextStep = {
    direction: null,
    endState: {},
  };

  // TODO: Only perform logic if not satisfied && has necessary properties !!!
  // TODO: Protect from missing stepConviction properties !!!

  // Determine all available steps at this moment in the world...
  const steps = calculateAvailableSteps(dot, world);
  if (debugConvictionStep && verboseConvictionStep) console.log(`[movement] [performConvictionStep] "${dot.id}" available steps =>`, steps);

  if (steps.length > 0) {
    let nextDirection = null;
    let adjustmentDirection = null;
    const resumeX1 = stepConviction.resumeX;
    const resumeY1 = stepConviction.resumeY;
    const resumeDirection = stepConviction.resumeDirection;
    const isXResuming = (resumeDirection === 'n' || resumeDirection === 's');
    const isYResuming = (resumeDirection === 'e' || resumeDirection === 'w');

    // If we want to resume n|s => try to get back to the "x" position...
    if (isXResuming && dot.x1 !== resumeX1) {
      adjustmentDirection = (dot.x1 > resumeX1) ? 'w' : 'e';
      if (objectUtils.includes(steps, adjustmentDirection)) nextDirection = adjustmentDirection;
      if (debugConvictionStep && verboseConvictionStep) console.log(`[movement] [performConvictionStep] "${dot.id}" trying to resume X position (${dot.x1} > ${resumeX1})?`);

    // If we want to resume e|w => try to get back to the "y" position...
    } else if (dot.y1 !== resumeY1) {
      adjustmentDirection = (dot.y1 > resumeY1) ? 'n' : 's';
      if (objectUtils.includes(steps, adjustmentDirection)) nextDirection = adjustmentDirection;
      if (debugConvictionStep && verboseConvictionStep) console.log(`[movement] [performConvictionStep] "${dot.id}" trying to resume Y position (${dot.y1} > ${resumeY1})?`);
    }

    // Try to head in the desired direction...
    if (!nextDirection && dot.currentDirection !== resumeDirection && objectUtils.includes(steps, resumeDirection)) {
      nextDirection = resumeDirection;
      if (debugConvictionStep && verboseConvictionStep) console.log(`[movement] [performConvictionStep] "${dot.id}" trying to resume direction (${dot.currentDirection} !== ${resumeDirection})?`);
    }

    // Otherwise, just wait...
    if (!nextDirection && debugConvictionStep && verboseConvictionStep) {
      console.log(`[movement] [performConvictionStep] "${dot.id}" is waiting to resume course`);
    }

    // Check if conviction is now satisfied...
    // (we just need to be headed in the intended vector direction)
    const isXAdjusted = (nextDirection === resumeDirection && dot.x1 === resumeX1);
    const isYAdjusted = (nextDirection === resumeDirection && dot.y1 === resumeY1);
    if ((isXResuming && isXAdjusted) || (isYResuming && isYAdjusted)) {
      if (debugConvictionStep && verboseConvictionStep) console.log(`[movement] [performConvictionStep] "${dot.id}" has satisifed the step conviction`);
      Object.assign(dot.convictions.step, { satisfied: true });
    }

    // Package step decision...
    nextStep.direction = nextDirection;
    nextStep.endState.currentDirection = nextDirection;
    Object.assign(nextStep.endState, generateStepEndState(dot, nextDirection));
  } // end-if (steps.length > 0)

  if (debugConvictionStep) {
    if (nextStep.direction) console.log(`[movement] [performConvictionStep] "${dot.id}" is stepping:`, nextStep.direction);
    else console.log(`[movement] [performConvictionStep] "${dot.id}" is not stepping`);
  }

  return nextStep;
}

const debugFreedomStep = false;
const verboseFreedomStep = false;

export function performFreedomStep(dot = {}, world = {}) {
  const nextStep = {
    direction: null,
    endState: {},
  };

  // Access movement memory...
  const shiftMemory = dot.moveShiftHistory.slice(0);

  // Determine all available steps at this moment in the world...
  const steps = calculateAvailableSteps(dot, world);
  if (debugFreedomStep && verboseFreedomStep) console.log(`[movement] [performFreedomStep] "${dot.id}" available steps =>`, steps);

  // If steps are available, decide which to take...
  if (steps.length > 0) {
    let direction = steps[0];
    const lastDirection = dot.currentDirection;

    // Try to continue in the same direction...
    if (objectUtils.includes(steps, lastDirection)) {
      direction = lastDirection;

    // Otherwise try to choose a fresh path...
    } else {
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

      // Record shift...
      shiftMemory.push(direction);
      if (shiftMemory.length > dot.memoryDepth) shiftMemory.shift(); // respect memory capacity
    } // end-if-else (objectUtils.includes(steps, lastDirection))

    // Generate step endState...
    const stepEndState = generateStepEndState(dot, direction);

    // Package step decision...
    nextStep.direction = direction;
    nextStep.endState.currentDirection = direction;
    nextStep.endState.moveShiftHistory = shiftMemory;
    Object.assign(nextStep.endState, stepEndState);
  } // end-if (steps.length > 0)

  if (debugFreedomStep) {
    if (nextStep.direction) console.log(`[movement] [performFreedomStep] "${dot.id}" is stepping:`, nextStep.direction);
    else console.log(`[movement] [performFreedomStep] "${dot.id}" is not stepping`);
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

  return headOn;
}

export function isDotApproaching(/* observer = {}, other = {} */) {
}

// -----------------------------------------------------------
// Returns an array of dots that are nearby the provided dot.
// -----------------------------------------------------------
export function getNearbyDots(observer = {}, others = {}, visionDepth = 1) {
  const nearby = [];

  Object.keys(others).forEach((dotID) => {
    if (dotID !== observer.id) {
      const other = others[dotID];
      if (isDotInRange(observer, other, visionDepth)) nearby.push(other);
    }
  });

  return nearby;
}

// -----------------------------------------------------------
// Determines if the provided other is in visible range
// of the provided observer.
// -----------------------------------------------------------
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

// -----------------------------------------------------------
// Returns an array of physically available steps
// (prioritized by the world's polarity and chirality)
// -----------------------------------------------------------
export function calculateAvailableSteps(dot = {}, world = {}) {
  const steps = [];

  const polarity = world.polarity;
  const chirality = world.chirality;
  const worldEast = world.x2;
  const worldWest = world.x1;
  const worldNorth = world.y1;
  const worldSouth = world.y2;

  const step = dot.width;
  const nextDotEast = dot.x2 + step;
  const nextDotWest = dot.x1 - step;
  const nextDotNorth = dot.y1 - step;
  const nextDotSouth = dot.y2 + step;

  // if (polarity === 'U' && chirality === 'R') {
  //   if (nextDotNorth > worldNorth) steps.push('n');
  //   if (nextDotEast < worldEast) steps.push('e');
  //   if (nextDotSouth < worldSouth) steps.push('s');
  //   if (nextDotWest > worldWest) steps.push('w');
  // } else if (polarity === 'D' && chirality === 'R') {
  //   if (nextDotSouth < worldSouth) steps.push('s');
  //   if (nextDotEast < worldEast) steps.push('e');
  //   if (nextDotNorth > worldNorth) steps.push('n');
  //   if (nextDotWest > worldWest) steps.push('w');
  // } else if (polarity === 'U' && chirality === 'L') {
  //   if (nextDotNorth > worldNorth) steps.push('n');
  //   if (nextDotWest > worldWest) steps.push('w');
  //   if (nextDotSouth < worldSouth) steps.push('s');
  //   if (nextDotEast < worldEast) steps.push('e');
  // } else if (polarity === 'D' && chirality === 'L') {
  //   if (nextDotSouth < worldSouth) steps.push('s');
  //   if (nextDotEast < worldEast) steps.push('e');
  //   if (nextDotNorth > worldNorth) steps.push('n');
  //   if (nextDotWest > worldWest) steps.push('w');
  // }

  // FOR TESTING !!!
  if (polarity && chirality) {
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
