'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = ArrayBuffer.prototype.slice;
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
