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
const typedArrayByteOffSet = (0, _shared.uncurryThis)(Object.getOwnPropertyDescriptor(_shared.TypedArrayPrototype, 'byteOffset').get);
const g = (value)=>{
    try {
        return typedArrayByteOffSet(value);
    } catch (e) {
        return false;
    }
};
const _default = g;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
