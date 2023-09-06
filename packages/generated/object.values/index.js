'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = Object.values;
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
