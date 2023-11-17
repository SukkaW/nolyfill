/* eslint-disable prefer-arrow-callback -- get env */
'use strict';

const functionsHaveConfigurableLengths = Object.getOwnPropertyDescriptor(function () {}, 'length').configurable;

const functionsHaveWritableLengths = Object.getOwnPropertyDescriptor(function () {}, 'length').writable;

const boundFnsHaveConfigurableLengths = Object.getOwnPropertyDescriptor((function () {}).bind(), 'length').configurable;

const boundFnsHaveWritableLengths = Object.getOwnPropertyDescriptor((function () {}).bind(), 'length').writable;

module.exports = {
  __proto__: null,
  boundFnsHaveConfigurableLengths,
  boundFnsHaveWritableLengths,
  functionsHaveConfigurableLengths,
  functionsHaveWritableLengths
};
