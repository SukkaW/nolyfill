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
    if (typeof value === "string") return true;
    if (typeof value !== "object") return false;
    try {
        String.prototype.valueOf.call(value);
        return true;
    } catch (e) {
        return false;
    }
};
var _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
