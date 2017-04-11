import objectUtils from '../helpers/object-utils';

export default class Dot {
  constructor(data = {}) {
    this.type = this.constructor.name;

    const isNew = objectUtils.get(data, 'new', false);
    this.id = objectUtils.get(data, 'id', `dot-${new Date().getTime()}`);
    this.name = objectUtils.get(data, 'name', 'Anon');
    this.index = objectUtils.get(data, 'index', -1);

    if (isNew) console.log(`[MODEL] Dot is born: ${this.name}`);
    else console.log(`[MODEL] Dot is hydrating: ${this.name}`);
    console.log('[MODEL] with data =>', data);

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
  getNextMove() {
    const newX1 = Number(this.x1) + 10;
    const move = {
      translateX: `${newX1}px`,
    };

    return move;
  }

  applyMove(newLocation) {
    if (newLocation.x1) this.x1 = newLocation.x1;
    if (newLocation.x2) this.x2 = newLocation.x2;
    if (newLocation.y1) this.y1 = newLocation.y1;
    if (newLocation.y2) this.y2 = newLocation.y2;
  }

  // ----------------------------------------------- Serialize
  // (Converts the dot info into a flat object)
}
