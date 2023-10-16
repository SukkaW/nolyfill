const safeRegexTest = (r?: RegExp | null | undefined) => {
  if (
    !r
    || (typeof r !== 'object' && typeof r !== 'function')
    || Object.prototype.toString.call(r) !== '[object RegExp]'
  ) {
    throw new TypeError('`regex` must be a RegExp');
  }
  return (s: string) => RegExp.prototype.exec.call(r, s) !== null;
};

export default safeRegexTest;
