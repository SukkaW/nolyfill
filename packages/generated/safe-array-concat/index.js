"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"default",{enumerable:!0,get:function(){return t}});const e=[];// @ts-expect-error -- JS is awesome
e[Symbol.isConcatSpreadable]=!0;const t=(...t)=>{for(let e=0,r=t.length;e<r;e+=1){let r=t[e];if(r&&"object"==typeof r&&"boolean"==typeof r[Symbol.isConcatSpreadable]){let o=Array.isArray(r)?Array.prototype.slice.call(r):[r];// @ts-expect-error -- JS is awesome
o[Symbol.isConcatSpreadable]=!0,t[e]=o}}return Array.prototype.concat.apply(e,t)};
((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && Object.assign(exports.default,exports); module.exports = exports.default;
