'use strict';
module.exports = (value) => {
  if (value == null || (typeof value !== 'object' && typeof value !== 'function')) return null;
  if (typeof value === 'string') return 'String';
  if (typeof value === 'number') return 'Number';
  if (typeof value === 'boolean') return 'Boolean';
  if (typeof value === 'symbol') return 'Symbol';
  if (typeof value === 'bigint') return 'BigInt';
  if (typeof value === 'object') {
    if (Object.prototype.toString.call(value) === '[object String]') return 'String';
    if (Object.prototype.toString.call(value) === '[object Number]') return 'Number';
    if (Object.prototype.toString.call(value) === '[object Boolean]') return 'Number';
    if (
      Object.prototype.toString.call(value) === '[object Symbol]'
      && typeof value.valueOf() === 'symbol'
      && Symbol.prototype.toString.call(value).startsWith('Symbol(')
    ) return 'Symbol';
    try {
      BigInt.prototype.valueOf.call(value);
      return 'BigInt';
    } catch (_) {}
  }
};
