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
const hasPropertyDescriptors = ()=>true;
hasPropertyDescriptors.hasArrayLengthDefineBug = ()=>false;
const _default = hasPropertyDescriptors;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
