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
var implementation = Object.groupBy || function groupBy(items, callbackfn) {
    var o = Object.create(null);
    var k = 0;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var value = _step.value;
            var key = callbackfn(value, k++);
            if (key in o) {
                Array.prototype.push.call(o[key], value);
            } else {
                o[key] = [
                    value
                ];
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return o;
};
var _default = (0, _shared.defineEsShim)(implementation, true);

Object.assign(exports.default, exports);
module.exports = exports.default;
