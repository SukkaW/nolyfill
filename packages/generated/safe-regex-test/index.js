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
var safeRegexTest = function(r) {
    if (!r || typeof r !== "object" && typeof r !== "function" || Object.prototype.toString.call(r) !== "[object RegExp]") {
        throw new TypeError("`regex` must be a RegExp");
    }
    return function(s) {
        return RegExp.prototype.exec.call(r, s) !== null;
    };
};
var _default = safeRegexTest;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
