"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _shared = require("@nolyfill/shared");
const implementation = Array.prototype.toSorted || function(compareFn) {
    const o = Object(this);
    const l = Number(o.length);
    const a = Array.from(l);
    for(let i = 0; i < l; i++){
        a[i] = o[i];
    }
    Array.prototype.sort.call(a, compareFn);
    return a;
};
const _default = (0, _shared.defineEsShim)(implementation);

Object.assign(exports.default, exports);
module.exports = exports.default;
