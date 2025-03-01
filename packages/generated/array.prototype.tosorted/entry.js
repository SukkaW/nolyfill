"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Array.prototype.toSorted
    || function toSorted(compareFn) {
        const o = Object(this);
        const l = Number(o.length);
        const a = new Array(l);
        for (let i = 0; i < l; i++) {
            a[i] = o[i];
        }
        Array.prototype.sort.call(a, compareFn);
        return a;
    };
exports.default = (0, shared_1.defineEsShim)(implementation);

Object.assign(exports.default, exports); module.exports = exports.default;
