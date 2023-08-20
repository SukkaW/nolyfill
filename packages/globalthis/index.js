'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = globalThis;
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
