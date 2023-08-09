'use strict';
const impl = Object.keys;
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
