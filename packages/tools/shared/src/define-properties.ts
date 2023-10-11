const defineProperty = (object: any, name: string | number | symbol, value: any, predicate: (() => boolean) | true | undefined) => {
  if (name in object) {
    if (predicate === true) {
      if (object[name] === value) {
        return;
      }
    } else if (
      typeof predicate !== 'function'
      || !predicate()
    ) {
      return;
    }
  }
  Object.defineProperty(object, name, {
    configurable: true,
    enumerable: false,
    value,
    writable: true
  });
};
export const defineProperties = <M extends object>(
  object: object,
  map: M & ThisType<any>,
  predicates?: Partial<Record<keyof M, () => boolean>>
) => {
  const props: Array<keyof M> = Array.prototype.concat.call(Object.keys(map), Object.getOwnPropertySymbols(map));
  for (let i = 0, l = props.length; i < l; i++) {
    const k = props[i];
    defineProperty(object, k, map[k], predicates?.[k]);
  }
};
