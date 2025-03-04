"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function is(value) {
    if (typeof value === 'string')
        return true;
    if (typeof value !== 'object')
        return false;
    try {
        String.prototype.valueOf.call(value);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.default = is;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
