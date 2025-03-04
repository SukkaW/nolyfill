"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const set = (object, value, options = {}) => {
    if (options.force || !Object.hasOwn(object, Symbol.toStringTag)) {
        Object.defineProperty(object, Symbol.toStringTag, {
            configurable: true,
            enumerable: false,
            value,
            writable: false
        });
    }
};
exports.default = set;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
