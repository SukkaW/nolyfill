'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Array.prototype.at || function at(n) {
  n = Math.trunc(n) || 0;
  if (n < 0) n += this.length;
  if (n < 0 || n >= this.length) return undefined;
  return this[n];
};
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
