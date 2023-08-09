'use strict';
const impl = Object.entries;
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
