"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const which = (value) => {
    if (value == null || (typeof value !== 'object' && typeof value !== 'function'))
        return null;
    if (typeof value === 'string')
        return 'String';
    if (typeof value === 'number')
        return 'Number';
    if (typeof value === 'boolean')
        return 'Boolean';
    if (typeof value === 'symbol')
        return 'Symbol';
    if (typeof value === 'bigint')
        return 'BigInt';
    if (typeof value === 'object') {
        const stringTag = Object.prototype.toString.call(value);
        if (stringTag === '[object String]')
            return 'String';
        if (stringTag === '[object Number]')
            return 'Number';
        if (stringTag === '[object Boolean]')
            return 'Number';
        if (stringTag === '[object Symbol]'
            && typeof value.valueOf() === 'symbol'
            && Symbol.prototype.toString.call(value).startsWith('Symbol('))
            return 'Symbol';
        try {
            BigInt.prototype.valueOf.call(value);
            return 'BigInt';
        }
        catch (_a) { }
    }
    return undefined;
};
exports.default = which;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
