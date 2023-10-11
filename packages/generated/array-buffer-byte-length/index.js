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
var _isarraybuffer = /*#__PURE__*/ _interop_require_default(require("@nolyfill/is-array-buffer"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var bL = (0, _shared.uncurryThis)(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
var is = function(ab) {
    if (!(0, _isarraybuffer.default)(ab)) return NaN;
    return bL(ab);
};
var _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
