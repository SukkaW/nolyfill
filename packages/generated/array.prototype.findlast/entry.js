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
const implementation = Array.prototype.findLast || function(callback, thisArg) {
    for(let i = this.length - 1; i >= 0; i--){
        const value = this[i];
        if (callback.call(thisArg, value, i, this)) return value;
    }
};
const _default = (0, _shared.defineEsShim)(implementation);

Object.assign(exports.default, exports);
module.exports = exports.default;
