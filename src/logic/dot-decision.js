// -------------------------------------------------------------
// dot-decision.js
//
// Logic for Dot decisions.
// -------------------------------------------------------------
import objectUtils from '../utils/object-utils';
import * as dotInteraction from './dot-interaction';
import * as dotStep from './dot-step';

const debug = true;
const verbose = true;

// nextMove: {
//   direction: '',
//   stepEndState: {},
// }
export function chooseNextMove(dot, world) {
  const nextMove = {
    stepEndState: {},
  };

  if (dot.type === 'Dot' && world.type === 'DotWorld') {
    // TODO: Access otherDot memory ???
    // Access movement memory...
    const shiftMemory = dot.moveShiftHistory.slice(0);

    // Check for nearby dots...
    const nearbyDots = dotInteraction.getNearbyDots(dot, world);
    if (nearbyDots.length > 0) {
      if (debug && verbose) console.log(`[decision] [${dot.id}] ${nearbyDots.length} nearby dot(s)`);
    }

    // TODO: Pass nearbyDots to include in calculation !!!
    // Determine all available moves at this moment in the world...
    const moves = dotStep.calculateAvailableSteps(dot, world);
    if (debug && verbose) console.log(`[decision] [${dot.id}] available moves =>`, moves);

    // If moves are available, decide which to take...
    if (moves.length > 0) {
      let direction = moves[0];
      const lastDirection = (shiftMemory.length > 0)
          ? shiftMemory[shiftMemory.length - 1]
          : null;

      // TODO: Reduce step options based upon desires wrt to nearby dots !!!
      //       (e.g. stay next to other, go towards other, go away from other)

      // Try to continue in the same direction...
      if (objectUtils.includes(moves, lastDirection)) {
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
          if (objectUtils.includes(shiftMemory, direction) && moves.length > 1) {
            let freshest = shiftMemory.length - 1;
            moves.forEach((move) => {
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
      } // end-if-else (objectUtils.includes(moves, lastDirection))

      // Generate step endState...
      const stepEndState = dotStep.generateStepEndState(dot, direction);

      // Package move decision...
      nextMove.direction = direction;
      nextMove.stepEndState.moveShiftHistory = shiftMemory;
      Object.assign(nextMove.stepEndState, stepEndState);
    } // end-if (moves.length > 0)

    // Increment events count...
    nextMove.stepEndState.events = dot.events + 1;
  }

  return nextMove;
}
