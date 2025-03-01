"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const typedArrayByteOffSet = (0, shared_1.uncurryThis)(Object.getOwnPropertyDescriptor(shared_1.TypedArrayPrototype, 'byteOffset').get);
function g(value) {
    try {
        return typedArrayByteOffSet(value);
    }
    catch (_a) {
        return false;
    }
}
;
exports.default = g;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
