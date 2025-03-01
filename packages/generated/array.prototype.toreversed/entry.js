"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Array.prototype.toReversed
    || function toReversed() {
        const o = Object(this);
        const l = Number(o.length);
        const a = new Array(l);
        let k = 0;
        while (k < l) {
            a[k] = o[l - k - 1];
            k += 1;
        }
        return a;
    };
exports.default = (0, shared_1.defineEsShim)(implementation);

Object.assign(exports.default, exports); module.exports = exports.default;
