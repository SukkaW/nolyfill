'use strict';
module.exports = (value) => {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) return false;
  return Object.prototype.toString.call(value) === '[object RegExp]';
};
