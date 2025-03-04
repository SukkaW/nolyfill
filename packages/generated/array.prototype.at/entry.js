"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Array.prototype.at || function at(n) {
    n = Math.trunc(n) || 0;
    if (n < 0)
        n += this.length;
    if (n < 0 || n >= this.length)
        return;
    return this[n];
};
exports.default = (0, shared_1.defineEsShim)(implementation);

Object.assign(exports.default, exports); module.exports = exports.default;
