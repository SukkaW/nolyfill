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
const implementation = Object.groupBy || function groupBy(items, callbackfn) {
    const o = Object.create(null);
    let k = 0;
    for (const value of items){
        const key = callbackfn(value, k++);
        if (key in o) {
            Array.prototype.push.call(o[key], value);
        } else {
            o[key] = [
                value
            ];
        }
    }
    return o;
};
const _default = (0, _shared.defineEsShim)(implementation, true);

Object.assign(exports.default, exports);
module.exports = exports.default;
