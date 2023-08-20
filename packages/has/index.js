'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Object.prototype.hasOwnProperty;
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
