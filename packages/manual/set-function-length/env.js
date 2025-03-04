/* eslint-disable prefer-arrow-callback -- get env */
'use strict';

const functionsHaveConfigurableLengths = Object.getOwnPropertyDescriptor(function () { /** noop */ }, 'length').configurable;

const functionsHaveWritableLengths = Object.getOwnPropertyDescriptor(function () { /** noop */ }, 'length').writable;

const boundFnsHaveConfigurableLengths = Object.getOwnPropertyDescriptor((function () { /** noop */ }).bind(), 'length').configurable;

const boundFnsHaveWritableLengths = Object.getOwnPropertyDescriptor((function () { /** noop */ }).bind(), 'length').writable;

module.exports = {
  __proto__: null,
  boundFnsHaveConfigurableLengths,
  boundFnsHaveWritableLengths,
  functionsHaveConfigurableLengths,
  functionsHaveWritableLengths
};
