'use strict';
const { uncurryThis } = require('@nolyfill/shared');
const impl = String.prototype.trimStart;
module.exports = uncurryThis(impl);
module.exports.implementation = impl;
module.exports.getPolyfill = () => impl;
module.exports.shim = () => impl;
