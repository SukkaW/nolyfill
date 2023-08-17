'use strict';
const empty = [];
empty[Symbol.isConcatSpreadable] = true;
module.exports = (...args) => {
  for (let i = 0, l = args.length; i < l; i += 1) {
    const arg = args[i];
    if (arg && typeof arg === 'object' && typeof arg[Symbol.isConcatSpreadable] === 'boolean') {
      const arr = Array.isArray(arg) ? Array.prototype.slice.call(arg) : [arg];
      arr[Symbol.isConcatSpreadable] = true;
      args[i] = arr;
    }
  }
  return Array.prototype.concat.apply(empty, args);
};
