"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
exports.default = (0, shared_1.defineEsShim)(Reflect.getPrototypeOf, true);

Object.assign(exports.default, exports); module.exports = exports.default;
