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
const implementation = Array.prototype.findLastIndex || function(callback, thisArg) {
    for(let i = this.length - 1; i >= 0; i--){
        if (callback.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
};
const _default = (0, _shared.defineEsShim)(implementation);

Object.assign(exports.default, exports);
module.exports = exports.default;
