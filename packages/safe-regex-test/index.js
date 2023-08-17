'use strict';
module.exports = (r) => {
  if (
    !r
		|| (typeof r !== 'object' && typeof r !== 'function')
		|| Object.prototype.toString.call(r) !== '[object RegExp]'
  ) {
    throw new TypeError('`regex` must be a RegExp');
  }
  return (s) => RegExp.prototype.exec.call(r, s) !== null;
};
