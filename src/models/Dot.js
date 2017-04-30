import objectUtils from '../utils/object-utils';
import * as dotInteraction from '../logic/dot-interaction';
import * as dotMovement from '../logic/dot-movement';
import * as dotMovementUI from '../logic/dot-movement-ui';

const debug = true;
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
// Make a move: getNextMove((endState) => applyMove(endState))
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
    this.speed = objectUtils.get(data, 'speed', 200);

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
    this.steps = objectUtils.get(data, 'steps', 0); // TODO: totalSteps
    this.currentDirection = objectUtils.get(data, 'currentDirection', null);
    this.moveShiftHistory = objectUtils.get(data, 'moveShiftHistory', []);

    // -----------------------------------------------------------
    // Interaction Management
    // -----------------------------------------------------------
    // events             => Total count of events lapsed since
    //                       birth (i.e. perceived time).
    //
    // totalInteractions  => Total count of interactions since
    //                       birth.
    // -----------------------------------------------------------
    this.events = objectUtils.get(data, 'events', 0); // TODO: totalEvents
    this.totalInteractions = objectUtils.get(data, 'totalInteractions', 0);
    this.totalInteractionsInitiated = objectUtils.get(data, 'totalInteractionsInitiated', 0);
    this.recipientInteractions = objectUtils.get(data, 'recipientInteractions', {});
    this.stepContract = objectUtils.get(data, 'stepContract', {});
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
  // Choose the next move
  // ---------------------------------------------------------------
  // nextMove: {
  //   endState: {},
  //   instruction: {},
  //   speed: 200,
  // }
  // ---------------------------------------------------------------
  getNextMove(world) {
    const nextMove = {
      endState: {},
    };

    // Check for interactions...
    const interactions = dotInteraction.interactWithOthers(this, world);
    Object.assign(nextMove.endState, interactions.endState);

    // Choose next step...
    const step = dotMovement.chooseNextStep(this, world);
    if (debug && verbose) console.log(`[MODEL] "${this.id}" next step chosen =>`, step);
    const stepEndState = step.endState;
    const direction = step.direction;

    // If we are moving, generate UI instruction...
    if (direction) {
      const distance = (objectUtils.has(stepEndState, 'fromX')) ? stepEndState.fromX : stepEndState.fromY;
      const stepInstruction = dotMovementUI.generateStepInstruction({ direction, distance });
      nextMove.instruction = stepInstruction;
      nextMove.speed = this.speed; // add speed
    }

    // Add step endState...
    Object.assign(nextMove.endState, stepEndState);

    if (debug) console.log(`[MODEL] "${this.id}" next move package =>`, nextMove);
    return nextMove;
  }

  // ----------------------------------------------
  // Apply everything that changed during this move
  // ----------------------------------------------
  applyMove(endState) {
    // if (debug) console.log(`[MODEL] "${this.id}" applying endState =>`, endState);

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
