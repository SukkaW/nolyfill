"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const bL = (0, shared_1.uncurryThis)(Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'byteLength').get);
function is(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    try {
        bL(obj);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.default = is;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
