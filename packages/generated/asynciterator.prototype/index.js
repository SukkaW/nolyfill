// @ts-expect-error -- AsyncIterator is not a real global value, just a mock
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var asyncIterProto = typeof AsyncIterator === "function" ? AsyncIterator.prototype : {};
if (!(Symbol.iterator in asyncIterProto)) {
    asyncIterProto[Symbol.iterator] = function() {
        return this;
    };
}
var _default = asyncIterProto;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
