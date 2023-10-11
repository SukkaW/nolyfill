const empty: any[] = [];
// @ts-expect-error -- JS is awesome
empty[Symbol.isConcatSpreadable] = true;

const concat = (...args: any[]) => {
  for (let i = 0, l = args.length; i < l; i += 1) {
    const arg = args[i];
    if (arg && typeof arg === 'object' && typeof arg[Symbol.isConcatSpreadable] === 'boolean') {
      const arr = Array.isArray(arg) ? Array.prototype.slice.call(arg) : [arg];
      // @ts-expect-error -- JS is awesome
      arr[Symbol.isConcatSpreadable] = true;
      args[i] = arr;
    }
  }
  return Array.prototype.concat.apply(empty, args);
};

export default concat;
