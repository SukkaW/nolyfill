'use strict';
module.exports = () => {
  let $wm;
  let $m;

  const channel = {
    assert(key) {
      if (!channel.has(key)) {
        throw new TypeError('Side channel does not contain the given key');
      }
    },
    get(key) {
      if (key && (typeof key === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $wm.get(key);
        }
      } else if ($m) {
        return $m.get(key);
      }
      return undefined;
    },
    has(key) {
      if (key && (typeof key === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $wm.has(key);
        }
      } else if ($m) {
        return $m.has(key);
      }
      return false;
    },
    set(key, value) {
      if (key && (typeof key === 'object' || typeof key === 'function')) {
        if (!$wm) {
          $wm = new WeakMap();
        }
        $wm.set(key, value);
      } else {
        if (!$m) {
          $m = new Map();
        }
        $m.set(key, value);
      }
    }
  };
  // eslint-disable-next-line @fluffyfox/no-redundant-variable -- self-reference
  return channel;
}
