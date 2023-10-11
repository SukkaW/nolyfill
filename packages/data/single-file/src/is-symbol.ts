const is = (value: unknown): value is symbol => {
  if (typeof value === 'symbol') return true;
  if (Object.prototype.toString.call(value) !== '[object Symbol]') return false;
  try {
    if (typeof (value as any).valueOf() !== 'symbol') return false;
    return Symbol.prototype.toString.call(value).startsWith('Symbol(');
  } catch (e) {
    return false;
  }
};

export default is;
