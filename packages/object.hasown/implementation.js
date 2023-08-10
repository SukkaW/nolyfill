'use strict';
module.exports = Object.hasOwn || require('@nolyfill/shared').uncurryThis(Object.prototype.hasOwnProperty);
