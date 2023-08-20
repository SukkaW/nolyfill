'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = Object.hasOwn || require('@nolyfill/shared').uncurryThis(Object.prototype.hasOwnProperty);
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
