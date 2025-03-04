"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dequal_1 = require("dequal");
const deepEqual = (a, b) => (0, dequal_1.dequal)(a, b);
exports.default = deepEqual;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
