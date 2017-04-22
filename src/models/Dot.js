import objectUtils from '../utils/object-utils';
import * as dotInteraction from '../logic/dot-interaction';
import * as dotStep from '../logic/dot-step';

const debug = false;
const verbose = false;

// -----------------------------------------------------------------------------
// The motivation of a Dot
// -----------------------------------------------------------------------------
// (1) To keep stimulated and avoid listlessness
// (2) To seek a higher level of pride
//
// -----------------------------------------------------------------------------
// The life of a Dot
// -----------------------------------------------------------------------------
// Make a move: chooseNextMove((endState) => applyMove(endState))
//
// (1) Determine physical movement (step or stay still)
//     ------------------------------------------------
//     (a) Look for interaction (if feeling social)
//                -or-
//         Avoid interaction (if feeling anti-social)
//
//     (b) Avoid walls
//
// (2) Interact (if collision occurs)
//     ------------------------------
//     (a) Exchange with each other(s)
//
//     (b) Evaluate other(s) individually
//
//     (c) Evaluate world as a whole
//         (based on evaluation of all others up to this point)
//
// (3) Evaluate self
//     -------------
//     (a) Assess all emotional states
//
//     (b) Qualify motivation in world
//
//     (c) Calculate level of pride
// -----------------------------------------------------------------------------

export default class Dot {
  constructor(data = {}) {
    this.type = this.constructor.name;

    // --------------
    // Identification
    // --------------
    const isNew = objectUtils.get(data, 'new', true);
    this.id = objectUtils.get(data, 'id', `dot-${new Date().getTime()}`);
    this.name = objectUtils.get(data, 'name', this.id);

    if (debug && isNew) {
      console.log(`A Dot is born: "${this.id}"`);
      if (verbose) console.log('with data =>', data);
    }

    // ----------
    // Birthplace
    // ----------
    this.birthX = objectUtils.get(data, 'birthX', 1);
    this.birthY = objectUtils.get(data, 'birthY', 1);

    // ---------------
    // Size attributes
    // ---------------
    this.width = objectUtils.get(data, 'width', 9);
    this.height = objectUtils.get(data, 'height', 9);

    // ----------------
    // Speed attributes
    // ----------------
    this.speed = objectUtils.get(data, 'speed', 2000);

    // -----------------
    // Vision attributes
    // -----------------
    this.visionDepth = objectUtils.get(data, 'visionDepth', 1);

    // -----------------------------------------------------------
    // Memory attributes
    // -----------------------------------------------------------
    // memoryDepth  => The max size of the moveShiftHistory array.
    // -----------------------------------------------------------
    this.memoryDepth = objectUtils.get(data, 'memoryDepth', 4);

    // -----------------------------------------------------------
    // Location Management
    // -----------------------------------------------------------
    if (objectUtils.has(data, 'birthLeft')) this.birthLeft = data.birthLeft;
    if (objectUtils.has(data, 'birthTop')) this.birthTop = data.birthTop;
    if (objectUtils.has(data, 'x1')) this.x1 = data.x1;
    if (objectUtils.has(data, 'x2')) this.x2 = data.x2;
    if (objectUtils.has(data, 'y1')) this.y1 = data.y1;
    if (objectUtils.has(data, 'y2')) this.y2 = data.y2;
    if (objectUtils.has(data, 'fromX')) this.fromX = data.fromX;
    if (objectUtils.has(data, 'fromY')) this.fromY = data.fromY;
    if (isNew) {
      // Calculate birthplace in world...
      this.birthLeft = this.birthX - 1;
      this.birthTop = this.birthY - 1;

      // Calculate location (by vertices)...
      this.x1 = this.birthX;
      this.x2 = this.birthX + (this.width - 1);
      this.y1 = this.birthY;
      this.y2 = this.birthY + (this.height - 1);

      // Track transformations from origin...
      this.fromX = 0;
      this.fromY = 0;
    }

    // -----------------------------------------------------------
    // Movement Management
    // -----------------------------------------------------------
    // steps         => Total steps taken since birth.
    // -----------------------------------------------------------
    this.isAsleep = objectUtils.get(data, 'isAsleep', true);
    this.steps = objectUtils.get(data, 'steps', 0);
    this.moveShiftHistory = objectUtils.get(data, 'moveShiftHistory', []);

    // -----------------------------------------------------------
    // Life Experience Memory
    // -----------------------------------------------------------
    // events         => Total count of events lapsed since birth
    //                   (i.e. perceived time).
    //
    // interactions   => Total count of interactions since birth.
    //
    // interactingWith  => A hash of dotIDs that are actively
    //                     interacting with him.
    // -----------------------------------------------------------
    this.events = objectUtils.get(data, 'events', 0);
    this.interactions = objectUtils.get(data, 'interactions', 0);
    this.interactingWith = objectUtils.get(data, 'interactingWith', {});
  }

  sleep() {
    this.isAsleep = true;
    if (debug) console.log(`[MODEL] "${this.id}" has been put to sleep`);
  }

  wake() {
    this.isAsleep = false;
    if (debug) console.log(`[MODEL] "${this.id}" has awoken`);
  }

  // ---------------------------------------------------------------
  // Choose the next event
  // ---------------------------------------------------------------
  chooseNextMove(world) {
    const nextMove = {
      endState: {},
      instruction: {},
    };

    // TODO: Access otherDot memory ???
    // Access movement memory...
    const shiftMemory = this.moveShiftHistory.slice(0);

    // Check for nearby dots...
    const nearbyDots = dotInteraction.getNearbyDots(this, world);
    if (nearbyDots.length > 0) {
      if (debug && verbose) console.log(`[MODEL] [${this.id}] ${nearbyDots.length} nearby dot(s)`);
    }

    // TODO: Pass nearbyDots to include in calculation !!!
    // Determine all available moves at this moment in the world...
    const moves = dotStep.calculateAvailableSteps(this, world);
    if (debug && verbose) console.log(`[MODEL] [${this.id}] available moves =>`, moves);

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
            console.log(`[MODEL] "${this.id}" is deciding on a new direction: ${firstOption}`);
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
            console.log(`[MODEL] "${this.id}" has selected ${direction} instead`);
          }
        } // end-if (lastDirection !== null)

        // Record shift...
        shiftMemory.push(direction);
        if (shiftMemory.length > this.memoryDepth) shiftMemory.shift(); // respect memory capacity
        nextMove.endState.moveShiftHistory = shiftMemory;
      }

      // Generate move data...
      const stepEndState = dotStep.generateStepEndState(this, direction);
      const distance = (objectUtils.has(stepEndState, 'fromX')) ? stepEndState.fromX : stepEndState.fromY;
      const stepInstruction = dotStep.generateStepInstruction({ direction, distance });
      Object.assign(nextMove.endState, stepEndState);
      Object.assign(nextMove.instruction, stepInstruction);
    } // end-if (moves.length > 0)

    // Increment events count...
    nextMove.endState.events = this.events + 1;

    if (debug) console.log(`[MODEL] "${this.id}" nextMove =>`, nextMove);
    return nextMove;
  }

  // -----------------------------------------------
  // Apply everything that changed during this event
  // -----------------------------------------------
  applyMove(endState) {
    if (debug) console.log(`[MODEL] "${this.id}" endState =>`, endState);

    Object.keys(endState).forEach((attr) => {
      this[attr] = endState[attr];
    });
  }

  // -----------------------------------------------
  // Evaluate
  // -----------------------------------------------
  // evaluate() {
  // }

  // ----------------------------------------------- Hydrate
  static hydrate(dotData) {
    dotData.new = false; // eslint-disable-line no-param-reassign
    return new Dot(dotData);
  }
}
