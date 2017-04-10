import objectUtils from '../helpers/object-utils';

export default class DotWorld {
  constructor(data = {}) {
    this.type = this.constructor.name;
    this.name = objectUtils.get(data, 'name', '');

    this.info = {};
    this.info.name = this.name;
    this.info.top = objectUtils.get(data, 'top', 0);
    this.info.left = objectUtils.get(data, 'left', 0);
    this.info.height = objectUtils.get(data, 'height', 300);
    this.info.width = objectUtils.get(data, 'width', 300);

    this.dots = objectUtils.get(data, 'dots', []);
    this.dotRegistry = {};
  }

  get top() {
    return this.info.top;
  }

  get left() {
    return this.info.left;
  }

  get height() {
    return this.info.height;
  }

  get width() {
    return this.info.width;
  }

  // ----------------------------------------------- Serialize
  // (Converts the world info into a flat object)
  toStore() {
    return this.info;
  }
}
