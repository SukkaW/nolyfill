'use strict';
module.exports = (value) => {
  if (typeof value !== 'object' || value === null) return false;
  try {
    Date.prototype.getDay.call(value);
    return true;
  } catch (e) {
    return false;
  }
};
