const is = (value: unknown): value is RegExp => {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) return false;
  return Object.prototype.toString.call(value) === '[object RegExp]';
};

export default is;
