'use strict';
const impl = Object.assign;
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
