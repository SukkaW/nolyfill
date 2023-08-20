'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = Object.groupBy || function (items, callbackfn) {
  const o = Object.create(null);
  let k = 0;
  for (const value of items) {
    const key = callbackfn(value, k++);
    if (key in o) {
      Array.prototype.push.call(o[key], value);
    } else {
      o[key] = [value];
    }
  }
  return o;
};
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
