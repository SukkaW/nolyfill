'use strict';
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
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
