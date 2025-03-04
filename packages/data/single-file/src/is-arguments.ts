function isStandardArguments(value: unknown): value is IArguments {
  return (value && typeof value === 'object' && Symbol.toStringTag in value)
    ? false
    : Object.prototype.toString.call(value) === '[object Arguments]';
}

function isLegacyArguments(value: unknown) {
  return isStandardArguments(value)
    ? true
    : (
      value !== null
      && typeof value === 'object'
      && 'length' in value
      && typeof value.length === 'number'
      && value.length >= 0
      && Object.prototype.toString.call(value) !== '[object Array]'
      && 'callee' in value
      && Object.prototype.toString.call(value.callee) === '[object Function]');
}
// isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests
// eslint-disable-next-line prefer-rest-params -- detect arguments object
export default (function () { return isStandardArguments(arguments); }()) ? isStandardArguments : isLegacyArguments;
