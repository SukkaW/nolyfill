'use strict';
const { uncurryThis } = require('@nolyfill/shared');
const impl = Array.prototype.findLastIndex || function (callback, thisArg) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (callback.call(thisArg, this[i], i, this)) return i;
  }
  return -1;
};
module.exports = uncurryThis(impl);
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
