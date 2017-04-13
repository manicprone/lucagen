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

    // ------------------
    // Birth requirements
    // ------------------
    this.width = objectUtils.get(data, 'width', 9);
    this.height = objectUtils.get(data, 'height', 9);
    this.birthX = objectUtils.get(data, 'birthX', 0);
    this.birthY = objectUtils.get(data, 'birthY', 0);
    this.speed = objectUtils.get(data, 'speed', 2000);

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
      this.birthLeft = this.birthX;
      this.birthTop = this.birthY;

      // Calculate location (by vertices)...
      this.x1 = this.birthX;
      this.x2 = this.birthX + this.width;
      this.y1 = this.birthY;
      this.y2 = this.birthY + this.height;

      // Track transformations from origin...
      this.fromX = 0;
      this.fromY = 0;
    }

    // -------------------
    // Movement Attributes
    // -------------------
    this.isAsleep = objectUtils.get(data, 'isAsleep', true);
    this.lastMoveDirection = objectUtils.get(data, 'lastMoveDirection', null);
    this.lastMoveShift = objectUtils.get(data, 'lastMoveShift', null);
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

    const moves = dotWorldUtils.determineAvailableMoves(this, world);
    if (debug) console.log(`[MODEL] "${this.id}" available moves =>`, moves);

    if (moves.length > 0) {
      // TODO: Try to select the same direction as before, otherwise, pick first !!!
      let direction = moves[0]; // pick first option

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
            console.log('--------------------------------------------------------------');
            console.log(`[MODEL] "${this.id}" is deciding on a new direction: ${direction} (last shift: ${this.lastMoveShift})`);
            console.log('--------------------------------------------------------------');
          }
          // If this direction is not new, and we have other options, take one...
          if (this.lastMoveShift && this.lastMoveShift === direction && moves.length > 1) {
            direction = moves[1]; // pick second option
            if (debug) console.log(`[MODEL] "${this.id}" has selected ${direction} instead from options =>`, moves);
          }
          // Record shift...
          this.lastMoveShift = this.lastMoveDirection;
        }

        // Record direction...
        this.lastMoveDirection = direction;
      } // end-if-else (!this.lastMoveDirection)

      // Generate move data...
      const endState = dotWorldUtils.generateMoveEndState(this, direction);
      const target = endState.fromX || endState.fromY;
      const instruction = dotWorldUtils.generateMoveInstruction({ direction, target });

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
    if (endState.x1) this.x1 = endState.x1;
    if (endState.x2) this.x2 = endState.x2;
    if (endState.y1) this.y1 = endState.y1;
    if (endState.y2) this.y2 = endState.y2;
    if (endState.fromX) this.fromX = endState.fromX;
    if (endState.fromY) this.fromY = endState.fromY;
  }

  // ----------------------------------------------- Serialize

  // ----------------------------------------------- Hydrate
  static hydrate(dotData) {
    dotData.new = false; // eslint-disable-line no-param-reassign
    return new Dot(dotData);
  }
}
