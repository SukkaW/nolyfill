"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lite_1 = require("dequal/lite");
const deepEqualJSON = (a, b) => (0, lite_1.dequal)(a, b);
exports.default = deepEqualJSON;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
