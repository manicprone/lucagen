// dot-movement.js — Logic for Dot movement (steps)
//
// Decision hierarchy:
//   1. Contract step — Honor agreements made with other Dots
//   2. Conviction step — Follow internal motivations
//   3. Freedom step — Wander freely, prefer continuity and freshest path

import Logger from '../services/DotLogger.js';
import * as dotMotivation from './dot-motivation.js';

const debug = false;
const verbose = false;

// --- Main entry point ---

export function chooseNextStep(dot, world) {
  const nextStep = {
    direction: null,
    endState: {},
  };

  // Check for active step contract with others
  const stepContract = dot.stepContracts.personal?.satisfied !== undefined
    ? dot.stepContracts.personal
    : null;

  // (1) Honor agreements made with other Dots
  if (stepContract && !stepContract.satisfied) {
    if (debug) Logger.sub('movement.chooseNextStep', `"${dot.id}" has an unsatisfied step contract`, stepContract);

    const nextDirection = stepContract.nextDirection;
    stepContract.satisfied = true;

    // If planning to return to a direction, create a conviction
    if (stepContract.resumeDirection !== undefined) {
      if (debug) Logger.sub('movement.chooseNextStep', `"${dot.id}" wants to resume direction`, stepContract.resumeDirection);
      dotMotivation.addStepConviction(dot, stepContract);
    }

    nextStep.direction = nextDirection;
    nextStep.endState.currentDirection = nextDirection;
    Object.assign(nextStep.endState, generateStepEndState(dot, nextDirection));

  // (2-3) Free to choose next step
  } else {
    const stepConviction = dot.convictions.step ?? null;

    if (stepConviction && !stepConviction.satisfied) {
      if (debug) Logger.sub('movement.chooseNextStep', `"${dot.id}" has an unsatisfied step conviction`, stepConviction);
      const convictionStep = performConvictionStep(dot, world, stepConviction);
      Object.assign(nextStep, convictionStep);
    } else {
      if (debug) Logger.sub('movement.chooseNextStep', `"${dot.id}" is free to wander`);
      const freedomStep = performFreedomStep(dot, world);
      Object.assign(nextStep, freedomStep);
    }
  }

  // Increment events count
  nextStep.endState.events = dot.events + 1;
  return nextStep;
}

// --- Conviction step ---

export function performConvictionStep(dot, world, stepConviction) {
  const nextStep = { direction: null, endState: {} };

  const steps = calculateAvailableSteps(dot, world);
  if (debug && verbose) Logger.sub('movement.performConvictionStep', `"${dot.id}" available steps`, steps);

  if (steps.length > 0) {
    let nextDirection = null;
    const { resumeX, resumeY, resumeDirection } = stepConviction;
    const isXResuming = resumeDirection === 'n' || resumeDirection === 's';
    const isYResuming = resumeDirection === 'e' || resumeDirection === 'w';

    // Try to get back to the resume position
    if (isXResuming && dot.x1 !== resumeX) {
      const adjustmentDirection = dot.x1 > resumeX ? 'w' : 'e';
      if (steps.includes(adjustmentDirection)) nextDirection = adjustmentDirection;
    } else if (dot.y1 !== resumeY) {
      const adjustmentDirection = dot.y1 > resumeY ? 'n' : 's';
      if (steps.includes(adjustmentDirection)) nextDirection = adjustmentDirection;
    }

    // Try to head in the desired direction
    if (!nextDirection && dot.currentDirection !== resumeDirection && steps.includes(resumeDirection)) {
      nextDirection = resumeDirection;
    }

    // Check if conviction is now satisfied
    const isXAdjusted = nextDirection === resumeDirection && dot.x1 === resumeX;
    const isYAdjusted = nextDirection === resumeDirection && dot.y1 === resumeY;
    if ((isXResuming && isXAdjusted) || (isYResuming && isYAdjusted)) {
      dot.convictions.step.satisfied = true;
    }

    nextStep.direction = nextDirection;
    nextStep.endState.currentDirection = nextDirection;
    Object.assign(nextStep.endState, generateStepEndState(dot, nextDirection));
  }

  if (debug) {
    if (nextStep.direction) Logger.sub('movement.performConvictionStep', `"${dot.id}" is stepping`, nextStep.direction);
    else Logger.sub('movement.performConvictionStep', `"${dot.id}" is not stepping`);
  }

  return nextStep;
}

// --- Freedom step ---

export function performFreedomStep(dot, world) {
  const nextStep = { direction: null, endState: {} };

  const shiftMemory = dot.moveShiftHistory.slice(0);
  const steps = calculateAvailableSteps(dot, world);

  if (steps.length > 0) {
    let direction = steps[0];
    const lastDirection = dot.currentDirection;

    // Try to continue in the same direction
    if (steps.includes(lastDirection)) {
      direction = lastDirection;

    // Otherwise choose the freshest path
    } else {
      if (shiftMemory.includes(direction) && steps.length > 1) {
        let freshest = shiftMemory.length - 1;
        for (const move of steps) {
          const index = shiftMemory.lastIndexOf(move);
          if (index < freshest) {
            freshest = index;
            direction = move;
          }
        }
      }

      // Record shift
      shiftMemory.push(direction);
      if (shiftMemory.length > dot.memoryDepth) shiftMemory.shift();
    }

    const stepEndState = generateStepEndState(dot, direction);
    nextStep.direction = direction;
    nextStep.endState.currentDirection = direction;
    nextStep.endState.moveShiftHistory = shiftMemory;
    Object.assign(nextStep.endState, stepEndState);
  }

  if (debug) {
    if (nextStep.direction) Logger.sub('movement.performFreedomStep', `"${dot.id}" is stepping`, nextStep.direction);
    else Logger.sub('movement.performFreedomStep', `"${dot.id}" is not stepping`);
  }

  return nextStep;
}

// --- Approaching / proximity ---

export function getApproachingDots(/* dot, others */) {
  return [];
}

export function isDotApproachingHeadOn(observer, other) {
  const od = observer.currentDirection;
  const td = other.currentDirection;

  if (od && td) {
    return (
      (od === 'n' && td === 's') ||
      (od === 's' && td === 'n') ||
      (od === 'e' && td === 'w') ||
      (od === 'w' && td === 'e')
    );
  }

  return false;
}

export function isDotApproaching(/* observer, other */) {
  return false;
}

// --- Nearby dots (legacy O(n) — use SpatialGrid.queryNearby for perf) ---

export function getNearbyDots(observer, others, visionDepth = 1) {
  const nearby = [];
  const ids = Object.keys(others);
  for (const dotID of ids) {
    if (dotID !== observer.id) {
      const other = others[dotID];
      if (isDotInRange(observer, other, visionDepth)) nearby.push(other);
    }
  }
  return nearby;
}

// Spatial-grid-aware version
export function getNearbyDotsSpatial(observer, spatialGrid) {
  if (!spatialGrid) return [];
  const visionRange = observer.visionDepth * observer.width;
  return spatialGrid.queryNearby(observer, visionRange);
}

export function isDotInRange(observer, other, visionDepth = 1) {
  if (observer.type !== 'Dot' || other.type !== 'Dot') return false;

  const distance = visionDepth * observer.width;
  const myNorthSight = (observer.y1 - 1) - distance;
  const myEastSight = (observer.x1 + 1) + distance;
  const mySouthSight = (observer.y2 + 1) + distance;
  const myWestSight = (observer.x2 - 1) - distance;

  return (
    other.x2 > myWestSight && other.x1 < myEastSight &&
    other.y2 > myNorthSight && other.y1 < mySouthSight
  );
}

// --- Available steps ---
// Returns array of physically available steps, prioritized by world polarity/chirality

export function calculateAvailableSteps(dot, world) {
  const steps = [];

  const { polarity, chirality, x2: worldEast, x1: worldWest, y1: worldNorth, y2: worldSouth } = world;
  const step = dot.width;
  const nextDotEast = dot.x2 + step;
  const nextDotWest = dot.x1 - step;
  const nextDotNorth = dot.y1 - step;
  const nextDotSouth = dot.y2 + step;

  // Full polarity/chirality prioritization (restored from prototype comments)
  if (polarity === 'U' && chirality === 'R') {
    if (nextDotNorth > worldNorth) steps.push('n');
    if (nextDotEast < worldEast) steps.push('e');
    if (nextDotSouth < worldSouth) steps.push('s');
    if (nextDotWest > worldWest) steps.push('w');
  } else if (polarity === 'D' && chirality === 'R') {
    if (nextDotSouth < worldSouth) steps.push('s');
    if (nextDotEast < worldEast) steps.push('e');
    if (nextDotNorth > worldNorth) steps.push('n');
    if (nextDotWest > worldWest) steps.push('w');
  } else if (polarity === 'U' && chirality === 'L') {
    if (nextDotNorth > worldNorth) steps.push('n');
    if (nextDotWest > worldWest) steps.push('w');
    if (nextDotSouth < worldSouth) steps.push('s');
    if (nextDotEast < worldEast) steps.push('e');
  } else if (polarity === 'D' && chirality === 'L') {
    if (nextDotSouth < worldSouth) steps.push('s');
    if (nextDotEast < worldEast) steps.push('e');
    if (nextDotNorth > worldNorth) steps.push('n');
    if (nextDotWest > worldWest) steps.push('w');
  }

  return steps;
}

export function getOrthogonalDirections(origin) {
  return (origin === 'n' || origin === 's')
    ? ['e', 'w']
    : ['n', 's'];
}

export function generateStepEndState(dot, direction) {
  const step = dot.width;
  const steps = dot.steps + 1;

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
  }
}
