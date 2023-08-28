'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = String.prototype.at || function at(n) {
  n = Math.trunc(n) || 0;
  if (n < 0) n += this.length;
  if (n < 0 || n >= this.length) return undefined;
  return String.prototype.charAt.call(this, n);
};
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
