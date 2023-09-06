'use strict';
module.exports = (value) => {
  if (typeof value === 'symbol') return true;
  if (Object.prototype.toString.call(value) !== '[object Symbol]') return false;
  try {
    if (typeof value.valueOf() !== 'symbol') return false;
    return Symbol.prototype.toString.call(value).startsWith('Symbol(');
  } catch (e) {
    return false;
  }
};
