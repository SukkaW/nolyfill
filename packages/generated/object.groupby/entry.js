"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Object.groupBy || function groupBy(items, callbackfn) {
    const o = Object.create(null);
    let k = 0;
    for (const value of items) {
        const key = callbackfn(value, k++);
        if (key in o) {
            Array.prototype.push.call(o[key], value);
        }
        else {
            o[key] = [value];
        }
    }
    return o;
};
exports.default = (0, shared_1.defineEsShim)(implementation, true);

Object.assign(exports.default, exports); module.exports = exports.default;
