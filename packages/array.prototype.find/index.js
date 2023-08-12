'use strict';
const { uncurryThis } = require('@nolyfill/shared');
const impl = Array.prototype.find;
module.exports = uncurryThis(impl);
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
