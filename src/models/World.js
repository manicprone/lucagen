import objectUtils from '../utils/object-utils';

export default class DotWorld {
  constructor(data = {}) {
    this.type = this.constructor.name;

    const isNew = objectUtils.get(data, 'new', true);
    this.name = objectUtils.get(data, 'name', `Lucagen-${new Date().getTime()}`);
    this.width = objectUtils.get(data, 'width', 400);
    this.height = objectUtils.get(data, 'height', 200);

    // Previosuly hydrated values...
    if (objectUtils.has(data, 'x1')) this.x1 = data.x1;
    if (objectUtils.has(data, 'x2')) this.x2 = data.x2;
    if (objectUtils.has(data, 'y1')) this.y1 = data.y1;
    if (objectUtils.has(data, 'y2')) this.y2 = data.y2;

    if (isNew) {
      // Generate vertices...
      this.x1 = 1;
      this.x2 = this.width;
      this.y1 = 1;
      this.y2 = this.height;
    }

    // Manage dots...
    this.dots = objectUtils.get(data, 'dots', []);
    this.dotRegistry = objectUtils.get(data, 'dotRegistry', {});
    this.freedomMode = true;
  }

  // ----------------------------------------------- Dot management
  addDot(dot) {
    const dotID = dot.id;
    if (dotID) {
      if (!this.dotRegistry[dotID]) this.dots.push(dotID);
      this.dotRegistry[dotID] = dot;
    }
  }

  pauseDots() {
    this.dots.forEach((dotID) => {
      const dot = this.dotRegistry[dotID];
      if (dot && !dot.isAsleep) dot.sleep();
    });
  }

  resumeDots() {
    this.dots.forEach((dotID) => {
      const dot = this.dotRegistry[dotID];
      if (dot && dot.isAsleep) dot.wake();
    });
  }

  setFreedom(value) {
    this.freedomMode = (value === true);
  }

  // ----------------------------------------------- Hydrate
  static hydrate(worldData) {
    worldData.new = false; // eslint-disable-line no-param-reassign
    return new DotWorld(worldData);
  }
}

/*

     x1_____x2
  W   |     |   E      (width)
      |_____|
      0     5


         N

    y1 _____ 5
      |     |          (height)
      |_____|
    y2       0

         S
*/
