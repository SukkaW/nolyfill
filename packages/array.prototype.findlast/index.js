'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Array.prototype.findLast || function (callback, thisArg) {
  for (let i = this.length - 1; i >= 0; i--) {
    const value = this[i];
    if (callback.call(thisArg, value, i, this)) return value;
  }
  return void undefined;
};
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
