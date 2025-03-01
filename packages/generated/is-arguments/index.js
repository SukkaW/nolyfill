"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isStandardArguments = (value) => ((value && typeof value === 'object' && Symbol.toStringTag in value)
    ? false
    : Object.prototype.toString.call(value) === '[object Arguments]');
const isLegacyArguments = (value) => (isStandardArguments(value)
    ? true
    : (value !== null
        && typeof value === 'object'
        && 'length' in value
        && typeof value.length === 'number'
        && value.length >= 0
        && Object.prototype.toString.call(value) !== '[object Array]'
        && 'callee' in value
        && Object.prototype.toString.call(value.callee) === '[object Function]'));
// isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests
// eslint-disable-next-line prefer-rest-params -- detect arguments object
exports.default = (function () { return isStandardArguments(arguments); }()) ? isStandardArguments : isLegacyArguments;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
