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
var bL = (0, _shared.uncurryThis)(Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get);
var is = function(obj) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    try {
        bL(obj);
        return true;
    } catch (_) {
        return false;
    }
};
var _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
