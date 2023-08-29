'use strict';
const isFnRegex = /^\s*(?:function)?\*/;
// Node.js has full native support for generators since Node.js 6.4.0, so we don't need eval
const GeneratorFunction = Object.getPrototypeOf(function* () {});
module.exports = function isGeneratorFunction(fn) {
  if (typeof fn !== 'function') return false;
  if (isFnRegex.test(Function.prototype.toString.call(fn))) return true;
  return Object.getPrototypeOf(fn) === GeneratorFunction;
};
