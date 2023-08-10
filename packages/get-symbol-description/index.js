'use strict';

const { uncurryThis } = require('@nolyfill/shared');
module.exports = uncurryThis(Object.getOwnPropertyDescriptor(Symbol.prototype, 'description').get);
