const isFnRegex = /^\s*(?:function)?\*/;
// Node.js has full native support for generators since Node.js 6.4.0, so we don't need eval
const GeneratorFunction = Object.getPrototypeOf(function *() { /** noop */ });
// eslint-disable-next-line @typescript-eslint/ban-types -- any function
function isGeneratorFunction(fn: unknown): fn is Function {
  if (typeof fn !== 'function') return false;
  if (isFnRegex.test(Function.prototype.toString.call(fn))) return true;
  return Object.getPrototypeOf(fn) === GeneratorFunction;
}

export default isGeneratorFunction;
