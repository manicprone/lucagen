import objectUtils from '../utils/object-utils';
import * as dotWorldUtils from '../utils/dot-world-utils';

const debug = true;
const verbose = false;

export default class Dot {
  constructor(data = {}) {
    this.type = this.constructor.name;

    const isNew = objectUtils.get(data, 'new', true);
    this.id = objectUtils.get(data, 'id', `dot-${new Date().getTime()}`);
    this.name = objectUtils.get(data, 'name', 'Anon');
    this.index = objectUtils.get(data, 'index', -1);

    if (debug) {
      if (isNew) console.log(`[MODEL] A Dot is born: ${this.id}`);
      else console.log(`[MODEL] A Dot is hydrating: ${this.id}`);
      if (verbose) console.log('[MODEL] with data =>', data);
    }

    // Birth requirements...
    this.width = objectUtils.get(data, 'width', 9);
    this.height = objectUtils.get(data, 'height', 9);
    this.birthX = objectUtils.get(data, 'birthX', 0); // x
    this.birthY = objectUtils.get(data, 'birthY', 0); // y
    this.speed = objectUtils.get(data, 'speed', 3000);

    // Previosuly hydrated values...
    if (objectUtils.has(data, 'birthLeft')) this.birthLeft = data.birthLeft;
    if (objectUtils.has(data, 'birthBottom')) this.birthBottom = data.birthBottom;
    if (objectUtils.has(data, 'x1')) this.x1 = data.x1;
    if (objectUtils.has(data, 'x2')) this.x2 = data.x2;
    if (objectUtils.has(data, 'y1')) this.y1 = data.y1;
    if (objectUtils.has(data, 'y2')) this.y2 = data.y2;

    if (isNew) {
      // Calculate birthplace in world...
      this.birthLeft = this.birthX;
      // TODO: this is supposed to be the world.height !!!
      this.birthBottom = -1 * (this.birthY - this.height);

      // Calculate location (by vertices)...
      this.x1 = this.birthX;
      this.x2 = this.birthX + this.width;
      this.y1 = this.birthY;
      this.y2 = this.birthY + this.height;
    }
  }

  // ----------------------------------------------- Size


  // ----------------------------------------------- Speed


  // ----------------------------------------------- Birthplace


  // ----------------------------------------------- Current location


  // ----------------------------------------------- Movement
  getNextMove(world) {
    const nextMove = {};

    const moves = dotWorldUtils.determineAvailableMoves(this, world);
    if (debug) console.log(`[MODEL][${this.id}] available moves =>`, moves);

    // For now, choose the first available...
    if (moves.length > 0) {
      const direction = moves[0];
      const endState = dotWorldUtils.generateMoveEndState(this, direction);
      const target = endState.x1 || endState.y1;
      const instruction = dotWorldUtils.generateMoveInstruction({ direction, target });

      // Add endState and instruction data to return package...
      nextMove.endState = endState;
      nextMove.instruction = instruction;

      if (debug) {
        console.log(`[MODEL][${this.id}] nextMove package for "${direction}" =>`, nextMove);
      }
    }

    return nextMove;
  }

  // getNextMove(world) {
  //   if (world && world.type === 'DotWorld') {
  //     const newX1 = Number(this.x1) + 10;
  //     const move = {
  //       translateX: `${newX1}px`,
  //     };
  //
  //     return move;
  //   }
  //
  //   return {};
  // }

  applyMove(newLocation) {
    if (newLocation.x1) this.x1 = newLocation.x1;
    if (newLocation.x2) this.x2 = newLocation.x2;
    if (newLocation.y1) this.y1 = newLocation.y1;
    if (newLocation.y2) this.y2 = newLocation.y2;
  }

  // ----------------------------------------------- Serialize

  // ----------------------------------------------- Hydrate
  static hydrate(dotData) {
    dotData.new = false; // eslint-disable-line no-param-reassign
    return new Dot(dotData);
  }
}
