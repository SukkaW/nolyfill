'use strict';
const impl = globalThis;
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
