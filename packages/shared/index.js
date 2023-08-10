'use strict';
const { bind, call } = Function.prototype;
const uncurryThis = bind.bind(call);
const TypedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);

module.exports.uncurryThis = uncurryThis;
module.exports.TypedArrayPrototype = TypedArrayPrototype;
