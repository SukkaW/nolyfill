'use strict';
/* globals WeakRef: false */
module.exports = (value) => {
  if (typeof WeakRef === 'undefined') return false;
  if (!value || typeof value !== 'object') return false;
  try {
    WeakRef.prototype.deref.call(value);
    return true;
  } catch (e) {
    return false;
  }
};
