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
var is = function(value) {
    if (!value || typeof value !== "object" && typeof value !== "function") return false;
    return Object.prototype.toString.call(value) === "[object RegExp]";
};
var _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
