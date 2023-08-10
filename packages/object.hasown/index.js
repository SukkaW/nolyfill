'use strict';
const impl = Object.hasOwn || require('@nolyfill/shared').uncurryThis(Object.prototype.hasOwnProperty);
module.exports = impl;
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
