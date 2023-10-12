const create = () => {
  let $wm: WeakMap<any, any> | undefined, $m: Map<any, any> | undefined;

  const get = (key: any) => {
    if (key && (typeof key === 'object' || typeof key === 'function')) {
      if ($wm) return $wm.get(key);
    } else if ($m) {
      return $m.get(key);
    }
    return undefined;
  };
  const set = (key: any, value: any) => {
    if (key && (typeof key === 'object' || typeof key === 'function')) {
      if (!$wm) $wm = new WeakMap();
      $wm.set(key, value);
    } else {
      if (!$m) $m = new Map();
      $m.set(key, value);
    }
  };
  const has = (key: any) => {
    if (key && (typeof key === 'object' || typeof key === 'function')) {
      if ($wm) {
        return $wm.has(key);
      }
    } else if ($m) {
      return $m.has(key);
    }
    return false;
  };
  const assert = (key: any) => {
    if (!has(key)) {
      throw new TypeError('Side channel does not contain the given key');
    }
  };
  return { get, set, has, assert };
};

export default create;
