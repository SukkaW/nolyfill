'use strict';
const impl = Object.fromEntries;
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
