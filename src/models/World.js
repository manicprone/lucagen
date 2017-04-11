import objectUtils from '../helpers/object-utils';

export default class DotWorld {
  constructor(data = {}) {
    // const now = new Date().getTime();
    this.type = this.constructor.name;
    this.name = objectUtils.get(data, 'name', `Lucagen-${new Date().getTime()}`);

    this.info = {};
    this.info.name = this.name;
    this.info.width = objectUtils.get(data, 'x', 400);
    this.info.height = objectUtils.get(data, 'y', 200);

    this.dots = objectUtils.get(data, 'dots', []);
    this.dotRegistry = {};
  }

  // ----------------------------------------------- Size
  get height() {
    return this.info.height;
  }
  get width() {
    return this.info.width;
  }

  // ----------------------------------------------- Dot management
  addDot(dot) {
    const dotID = dot.id;
    if (dotID) {
      if (!this.dotRegistry[dotID]) this.dots.push(dotID);
      this.dotRegistry[dotID] = dot;
    }
  }

  // ----------------------------------------------- Serialize
  // (Converts the world info into a flat object)
  getInfo() {
    return this.info;
  }
}
