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
const _shared = require("@nolyfill/shared");
const bL = (0, _shared.uncurryThis)(Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'byteLength').get);
const is = (obj)=>{
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    try {
        bL(obj);
        return true;
    } catch (e) {
        return false;
    }
};
const _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
