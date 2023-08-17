'use strict';
/* globals AsyncIterator: false */
var asyncIterProto = typeof AsyncIterator === 'function' ? AsyncIterator.prototype : {};
if (!(Symbol.iterator in asyncIterProto)) {
  asyncIterProto[Symbol.iterator] = function () { return this; };
}
module.exports = asyncIterProto;
