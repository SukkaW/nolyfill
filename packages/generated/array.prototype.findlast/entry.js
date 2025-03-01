"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- polyfill
const implementation = Array.prototype.findLast
    || function findLast(callback, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            const value = this[i];
            if (callback.call(thisArg, value, i, this))
                return value;
        }
        return undefined;
    };
exports.default = (0, shared_1.defineEsShim)(implementation);

Object.assign(exports.default, exports); module.exports = exports.default;
