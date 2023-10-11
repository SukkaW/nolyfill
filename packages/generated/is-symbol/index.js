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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var is = function(value) {
    if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === "symbol") return true;
    if (Object.prototype.toString.call(value) !== "[object Symbol]") return false;
    try {
        if (_type_of(value.valueOf()) !== "symbol") return false;
        return Symbol.prototype.toString.call(value).startsWith("Symbol(");
    } catch (e) {
        return false;
    }
};
var _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
