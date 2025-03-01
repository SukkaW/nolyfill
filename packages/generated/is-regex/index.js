"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is = (value) => {
    if (!value || (typeof value !== 'object' && typeof value !== 'function'))
        return false;
    return Object.prototype.toString.call(value) === '[object RegExp]';
};
exports.default = is;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
