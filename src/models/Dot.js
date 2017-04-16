import objectUtils from '../utils/object-utils';
import * as dotWorldUtils from '../utils/dot-world-utils';

const debug = true;
const verbose = false;

export default class Dot {
  constructor(data = {}) {
    this.type = this.constructor.name;

    // --------------
    // Identification
    // --------------
    const isNew = objectUtils.get(data, 'new', true);
    this.id = objectUtils.get(data, 'id', `dot-${new Date().getTime()}`);
    this.name = objectUtils.get(data, 'name', 'Anon');
    this.index = objectUtils.get(data, 'index', -1);

    if (debug && isNew) {
      console.log(`[MODEL] A Dot is born: "${this.id}"`);
      if (verbose) console.log('[MODEL] with data =>', data);
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

    // ---------------------------------------------------------
    // Memory attributes
    // ---------------------------------------------------------
    // memoryDepth => The max size of the moveShiftHistory
    //                array.
    // ---------------------------------------------------------
    this.memoryDepth = objectUtils.get(data, 'memoryDepth', 3);

    // -------------------
    // Location Management
    // -------------------
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

    // -------------------
    // Movement Management
    // -------------------
    this.isAsleep = objectUtils.get(data, 'isAsleep', true);
    this.lastMoveDirection = objectUtils.get(data, 'lastMoveDirection', null);
    this.lastMoveShift = objectUtils.get(data, 'lastMoveShift', null);
    this.moveShiftHistory = objectUtils.get(data, 'moveShiftHistory', []);
  }

  // ----------------------------------------------- Size


  // ----------------------------------------------- Speed


  // ----------------------------------------------- Birthplace


  // ----------------------------------------------- Current location


  // ----------------------------------------------- Movement
  sleep() {
    this.isAsleep = true;
    if (debug) console.log(`[MODEL] "${this.id}" has been put to sleep`);
  }

  wake() {
    this.isAsleep = false;
    if (debug) console.log(`[MODEL] "${this.id}" has awoken`);
  }

  getNextMove(world) {
    const nextMove = {};

    // Access movement memory...
    const shiftMemory = this.moveShiftHistory.slice(0);

    // Determine all available moves at this moment in the world...
    const moves = dotWorldUtils.determineAvailableMoves(this, world);
    if (debug) console.log(`[MODEL] "${this.id}" available moves =>`, moves);

    if (moves.length > 0) {
      // Try to continue in the same direction, otherwise consider first option...
      let direction = (objectUtils.includes(moves, this.lastMoveDirection))
        ? this.lastMoveDirection
        : moves[0];

      // -------------
      // First move...
      // -------------
      if (!this.lastMoveDirection) {
        this.lastMoveDirection = direction; // set initial
      // -------------------
      // Subsequent moves...
      // -------------------
      } else {
        // When encountering a cardinal shift, try to choose a fresh path...
        if (this.lastMoveDirection !== direction) {
          if (debug) {
            console.log('---------------------------------------------------------------------');
            console.log(`[MODEL] "${this.id}" is deciding on a new direction: ${direction}`);
            console.log(`        last shift: ${this.lastMoveShift}`);
            console.log('        history:', shiftMemory);
            console.log('----------------------------------------------------------------------');
          }
          // If this direction is not new, and we have other options, take one...
          if (this.lastMoveShift && this.lastMoveShift === direction && moves.length > 1) {
            direction = moves[1]; // pick second option
            if (debug) console.log(`[MODEL] "${this.id}" has selected ${direction} instead from options =>`, moves);
          }
          // Record shift...
          this.lastMoveShift = this.lastMoveDirection;
          shiftMemory.push(this.lastMoveDirection);
          this.moveShiftHistory = shiftMemory;
        }

        // Record direction...
        this.lastMoveDirection = direction;
      } // end-if-else (!this.lastMoveDirection)

      // Generate move data...
      const endState = dotWorldUtils.generateMoveEndState(this, direction);
      const distance = (objectUtils.has(endState, 'fromX')) ? endState.fromX : endState.fromY;
      const instruction = dotWorldUtils.generateMoveInstruction({ direction, distance });

      // Add endState and instruction data to return package...
      nextMove.endState = endState;
      nextMove.instruction = instruction;

      if (debug) {
        console.log(`[MODEL] "${this.id}" nextMove package for "${direction}" =>`, nextMove);
      }
    }

    return nextMove;
  }

  applyMove(endState) {
    if (objectUtils.has(endState, 'x1')) this.x1 = endState.x1;
    if (objectUtils.has(endState, 'x2')) this.x2 = endState.x2;
    if (objectUtils.has(endState, 'y1')) this.y1 = endState.y1;
    if (objectUtils.has(endState, 'y1')) this.y2 = endState.y2;
    if (objectUtils.has(endState, 'fromX')) this.fromX = endState.fromX;
    if (objectUtils.has(endState, 'fromY')) this.fromY = endState.fromY;
  }

  // ----------------------------------------------- Serialize

  // ----------------------------------------------- Hydrate
  static hydrate(dotData) {
    dotData.new = false; // eslint-disable-line no-param-reassign
    return new Dot(dotData);
  }
}
