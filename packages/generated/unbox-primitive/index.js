"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = unboxPrimitive;
function unboxPrimitive(value) {
    if (value == null || (typeof value !== 'object' && typeof value !== 'function')) {
        throw new TypeError(value === null ? 'value is an unboxed primitive' : 'value is a non-boxed-primitive object');
    }
    if (typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]') {
        return String.prototype.toString.call(value);
    }
    if (typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]') {
        return Number.prototype.valueOf.call(value);
    }
    if (typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Boolean]') {
        return Boolean.prototype.valueOf.call(value);
    }
    if (typeof value === 'symbol' || (Object.prototype.toString.call(value) === '[object Symbol]'
        && typeof value.valueOf() === 'symbol'
        && Symbol.prototype.toString.call(value).startsWith('Symbol('))) {
        return Symbol.prototype.valueOf.call(value);
    }
    try {
        return BigInt.prototype.valueOf.call(value);
    }
    catch (_a) { }
    throw new RangeError('unknown boxed primitive');
}

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
