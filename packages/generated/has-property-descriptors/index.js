'use strict';
const hasPropertyDescriptors = () => true;
hasPropertyDescriptors.hasArrayLengthDefineBug = () => false;
module.exports = hasPropertyDescriptors;
