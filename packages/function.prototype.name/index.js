'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = Function.prototype.name;
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
