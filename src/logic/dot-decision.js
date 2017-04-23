// -------------------------------------------------------------
// dot-decision.js
//
// Logic for Dot decisions.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';
// import * as dotInteraction from './dot-interaction';
import * as dotMovement from './dot-movement';

const debug = true;
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
    // TODO: Access otherDot memory ???
    // Access movement memory...
    const shiftMemory = dot.moveShiftHistory.slice(0);

    // Determine all available steps at this moment in the world...
    const steps = dotMovement.calculateAvailableSteps(dot, world);
    if (debug && verbose) console.log(`[decision] [${dot.id}] available steps =>`, steps);

    // If steps are available, decide which to take...
    if (steps.length > 0) {
      let direction = steps[0];
      const lastDirection = (shiftMemory.length > 0)
          ? shiftMemory[shiftMemory.length - 1]
          : null;

      // TODO: Reduce step options based upon desires wrt to nearby dots !!!
      //       (e.g. stay next to other, go towards other, go away from other)

      // Try to continue in the same direction...
      if (objectUtils.includes(steps, lastDirection)) {
        direction = lastDirection;

      // Otherwise try to choose a fresh path...
      } else {
        if (lastDirection !== null) {
          const firstOption = direction;

          if (debug && verbose) {
            console.log('---------------------------------------------------------------------');
            console.log(`[decision] "${dot.id}" is deciding on a new direction: ${firstOption}`);
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
            console.log(`[decision] "${dot.id}" has selected ${direction} instead`);
          }
        } // end-if (lastDirection !== null)

        // Record shift...
        shiftMemory.push(direction);
        if (shiftMemory.length > this.memoryDepth) shiftMemory.shift(); // respect memory capacity
      } // end-if-else (objectUtils.includes(steps, lastDirection))

      // Generate step endState...
      const stepEndState = dotMovement.generateStepEndState(dot, direction);

      // Package step decision...
      nextStep.direction = direction;
      nextStep.endState.moveShiftHistory = shiftMemory;
      Object.assign(nextStep.endState, stepEndState);
    } // end-if (steps.length > 0)

    // Increment events count...
    nextStep.endState.events = dot.events + 1;
  }

  return nextStep;
}
