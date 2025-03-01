"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hasPropertyDescriptors = () => true;
hasPropertyDescriptors.hasArrayLengthDefineBug = () => false;
exports.default = hasPropertyDescriptors;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
