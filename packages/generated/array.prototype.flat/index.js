'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Array.prototype.flat;
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
