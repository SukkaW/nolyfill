"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Array.prototype.findLastIndex
    || function findLastIndex(callback, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (callback.call(thisArg, this[i], i, this))
                return i;
        }
        return -1;
    };
exports.default = (0, shared_1.defineEsShim)(implementation);

Object.assign(exports.default, exports); module.exports = exports.default;
