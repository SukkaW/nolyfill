'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = String.prototype.trimLeft;
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
