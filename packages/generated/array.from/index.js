'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = Array.from;
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
