"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isTypedArray;
const which_typed_array_1 = __importDefault(require("@nolyfill/which-typed-array"));
function isTypedArray(value) {
    return !!(0, which_typed_array_1.default)(value);
}

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
