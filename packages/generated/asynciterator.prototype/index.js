"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error -- AsyncIterator is not a real global value, just a mock
const asyncIterProto = typeof AsyncIterator === 'function' ? AsyncIterator.prototype : {};
if (!(Symbol.iterator in asyncIterProto)) {
    asyncIterProto[Symbol.iterator] = function () { return this; };
}
exports.default = asyncIterProto;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
