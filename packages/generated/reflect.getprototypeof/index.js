'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = Reflect.getPrototypeOf;
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
