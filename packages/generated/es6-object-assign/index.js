"use strict";
module.exports = {
    polyfill () {
    // noop
    }
};

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
