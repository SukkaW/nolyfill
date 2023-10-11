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
var which = function(value) {
    if (value == null || typeof value !== "object" && typeof value !== "function") return null;
    if (typeof value === "string") return "String";
    if (typeof value === "number") return "Number";
    if (typeof value === "boolean") return "Boolean";
    if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === "symbol") return "Symbol";
    if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === "bigint") return "BigInt";
    if (typeof value === "object") {
        var stringTag = Object.prototype.toString.call(value);
        if (stringTag === "[object String]") return "String";
        if (stringTag === "[object Number]") return "Number";
        if (stringTag === "[object Boolean]") return "Number";
        if (stringTag === "[object Symbol]" && _type_of(value.valueOf()) === "symbol" && Symbol.prototype.toString.call(value).startsWith("Symbol(")) return "Symbol";
        try {
            BigInt.prototype.valueOf.call(value);
            return "BigInt";
        } catch (_) {}
    }
};
var _default = which;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
