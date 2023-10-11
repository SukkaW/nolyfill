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
var _shared = require("@nolyfill/shared");
var implementation = Array.prototype.findLast || function(callback, thisArg) {
    for(var i = this.length - 1; i >= 0; i--){
        var value = this[i];
        if (callback.call(thisArg, value, i, this)) return value;
    }
};
var _default = (0, _shared.defineEsShim)(implementation);

Object.assign(exports.default, exports);
module.exports = exports.default;
