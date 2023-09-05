'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Array.prototype.findLastIndex || function (callback, thisArg) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (callback.call(thisArg, this[i], i, this)) return i;
  }
  return -1;
};
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
