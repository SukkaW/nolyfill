const is = (value: any): value is string => {
  if (typeof value === 'string') return true;
  if (typeof value !== 'object') return false;
  try {
    String.prototype.valueOf.call(value);
    return true;
  } catch (e) { return false; }
};

export default is;
