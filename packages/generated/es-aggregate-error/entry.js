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
var implementation = typeof AggregateError === "function" ? AggregateError : function() {
    function AggregateError1(errors, message) {
        var error = new Error(message);
        Object.setPrototypeOf(error, AggregateError1.prototype);
        // @ts-expect-error -- manipulating to fake inheritance
        delete error.constructor;
        Object.defineProperty(error, "errors", {
            value: Array.from(errors)
        });
        return error;
    }
    Object.defineProperty(AggregateError1, "prototype", {
        writable: false
    });
    Object.defineProperties(AggregateError1.prototype, {
        constructor: {
            enumerable: false,
            configurable: true,
            writable: true,
            value: AggregateError1
        },
        message: {
            enumerable: false,
            configurable: true,
            writable: true,
            value: ""
        },
        name: {
            enumerable: false,
            configurable: true,
            writable: true,
            value: "AggregateError"
        }
    });
    Object.setPrototypeOf(AggregateError1.prototype, Error.prototype);
    return AggregateError1;
}();
var _default = (0, _shared.defineEsShim)(implementation, true);

Object.assign(exports.default, exports);
module.exports = exports.default;
