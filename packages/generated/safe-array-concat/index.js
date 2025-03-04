"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty = [];
// @ts-expect-error -- JS is awesome
empty[Symbol.isConcatSpreadable] = true;
const concat = (...args) => {
    for (let i = 0, l = args.length; i < l; i += 1) {
        const arg = args[i];
        if (arg && typeof arg === 'object' && Symbol.isConcatSpreadable in arg && typeof arg[Symbol.isConcatSpreadable] === 'boolean') {
            const arr = Array.isArray(arg) ? Array.prototype.slice.call(arg) : [arg];
            // @ts-expect-error -- JS is awesome
            arr[Symbol.isConcatSpreadable] = true;
            args[i] = arr;
        }
    }
    return Array.prototype.concat.apply(empty, args);
};
exports.default = concat;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
