"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is = (value) => {
    if (typeof value !== 'object' || value === null)
        return false;
    try {
        Date.prototype.getDay.call(value);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.default = is;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
