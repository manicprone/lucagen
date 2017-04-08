const lodashObject = require('lodash/object');
const lodashLang = require('lodash/lang');

module.exports = {
  get: lodashObject.get,
  has: lodashObject.has,
  isEmpty: lodashLang.isEmpty,
};
