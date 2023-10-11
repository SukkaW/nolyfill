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
var implementation = Array.prototype.toSorted || function(compareFn) {
    var o = Object(this);
    var l = Number(o.length);
    var a = Array.from(l);
    for(var i = 0; i < l; i++){
        a[i] = o[i];
    }
    Array.prototype.sort.call(a, compareFn);
    return a;
};
var _default = (0, _shared.defineEsShim)(implementation);

Object.assign(exports.default, exports);
module.exports = exports.default;
