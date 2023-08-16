'use strict';
const impl = Reflect.getPrototypeOf;
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
