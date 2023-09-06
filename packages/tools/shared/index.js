'use strict';
/** uncurryThis */
const { bind, call } = Function.prototype;
const uncurryThis = bind.bind(call);
module.exports.uncurryThis = uncurryThis;
/** TypedArrayPrototype */
const TypedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);
module.exports.TypedArrayPrototype = TypedArrayPrototype;
/** defineProperties */
const defineProperty = (object, name, value, predicate) => {
  if (name in object) {
    if (predicate === true) {
      if (object[name] === value) {
        return;
      }
    } else if (
      !(typeof predicate === 'function' && Object.prototype.toString.call(predicate) === '[object Function]')
      || !predicate()
    ) {
      return;
    }
  }
  Object.defineProperty(object, name, {
    configurable: true,
    enumerable: false,
    value,
    writable: true
  });
};
const defineProperties = (object, map, predicates = {}) => {
  const props = Array.prototype.concat.call(Object.keys(map), Object.getOwnPropertySymbols(map));
  for (let i = 0, l = props.length; i < l; i++) {
    defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
  }
};
module.exports.defineProperties = defineProperties;
/** makeEsShim */
const makeEsShim = (shim, implementation) => defineProperties(shim, {
  implementation,
  getPolyfill: () => implementation,
  shim: () => implementation
});
module.exports.makeEsShim = makeEsShim;
