'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Array.prototype.toSorted || function (compareFn) {
  const o = Object(this);
  const l = Number(o.length);
  const a = new Array(l);
  for (let i = 0; i < l; i++) {
    a[i] = o[i];
  }
  Array.prototype.sort.call(a, compareFn);
  return a;
};
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
