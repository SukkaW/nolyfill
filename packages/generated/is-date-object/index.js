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
const is = (value)=>{
    if (typeof value !== 'object' || value === null) return false;
    try {
        Date.prototype.getDay.call(value);
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
