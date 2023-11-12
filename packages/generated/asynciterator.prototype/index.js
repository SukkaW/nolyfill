// @ts-expect-error -- AsyncIterator is not a real global value, just a mock
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"default",{enumerable:!0,get:function(){return e}});const t="function"==typeof AsyncIterator?AsyncIterator.prototype:{};Symbol.iterator in t||(t[Symbol.iterator]=function(){return this});const e=t;
((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && Object.assign(exports.default,exports); module.exports = exports.default;
