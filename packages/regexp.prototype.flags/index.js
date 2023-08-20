'use strict';
const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
const impl = RegExp.prototype.flags;
const bound = uncurryThis(impl);
makeEsShim(bound, impl);
module.exports = bound;
