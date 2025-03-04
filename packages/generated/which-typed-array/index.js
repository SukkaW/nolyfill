"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const availableTypedArray = [
    'BigInt64Array', 'BigUint64Array',
    'Float32Array', 'Float64Array',
    'Int16Array', 'Int32Array', 'Int8Array',
    'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'
];
const cacheEntries = Object.entries(availableTypedArray.reduce((acc, typedArray) => {
    const proto = Object.getPrototypeOf(new globalThis[typedArray]());
    acc[`$${typedArray}`] = (0, shared_1.uncurryThis)((Object.getOwnPropertyDescriptor(proto, Symbol.toStringTag)
        || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto), Symbol.toStringTag)).get);
    return acc;
}, Object.create(null)));
function tryTypedArrays(value) {
    let found = false;
    cacheEntries.forEach(([typedArray, getter]) => {
        if (!found) {
            try {
                if (`$${getter(value)}` === typedArray) {
                    found = typedArray.slice(1);
                }
            }
            catch ( /**/_a) { /**/ }
        }
    });
    return found;
}
function t(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    return tryTypedArrays(value);
}
exports.default = t;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
