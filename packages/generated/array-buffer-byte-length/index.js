"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const is_array_buffer_1 = __importDefault(require("@nolyfill/is-array-buffer"));
const bL = (0, shared_1.uncurryThis)(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get);
function byteLength(ab) {
    if (!(0, is_array_buffer_1.default)(ab))
        return Number.NaN;
    return bL(ab);
}
exports.default = byteLength;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
