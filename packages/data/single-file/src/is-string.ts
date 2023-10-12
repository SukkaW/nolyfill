const is = (value: unknown): value is string => {
  if (typeof value === 'string') return true;
  if (typeof value !== 'object') return false;
  try {
    String.prototype.valueOf.call(value);
    return true;
  } catch { return false; }
};

export default is;
