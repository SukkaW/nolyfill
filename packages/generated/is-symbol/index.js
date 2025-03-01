"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is = (value) => {
    if (typeof value === 'symbol')
        return true;
    if (Object.prototype.toString.call(value) !== '[object Symbol]')
        return false;
    try {
        if (typeof value.valueOf() !== 'symbol')
            return false;
        return Symbol.prototype.toString.call(value).startsWith('Symbol(');
    }
    catch (_a) {
        return false;
    }
};
exports.default = is;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
