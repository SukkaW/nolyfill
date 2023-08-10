'use strict';

const { uncurryThis } = require('@nolyfill/shared');
module.exports = uncurryThis(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Int8Array.prototype), 'buffer').get);
