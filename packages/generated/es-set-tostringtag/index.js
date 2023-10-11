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
var set = function(object, value) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (options.force || !Object.hasOwn(object, Symbol.toStringTag)) {
        Object.defineProperty(object, Symbol.toStringTag, {
            configurable: true,
            enumerable: false,
            value: value,
            writable: false
        });
    }
};
var _default = set;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
