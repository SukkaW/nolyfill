const channel = new WeakMap();
const check = (O: WeakKey, slot: string) => {
  if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
    throw new TypeError('`O` is not an object');
  }
  if (typeof slot !== 'string') {
    throw new TypeError('`slot` must be a string');
  }
};
const has = (O: WeakKey, slot: string) => {
  check(O, slot);
  const slots = channel.get(O);
  return !!slots && Object.prototype.hasOwnProperty.call(slots, `$${slot}`);
};
const get = (O: WeakKey, slot: string) => {
  check(O, slot);
  const slots = channel.get(O);
  return slots && slots[`$${slot}`];
};
const set = (O: WeakKey, slot: string, V: any) => {
  check(O, slot);
  let slots = channel.get(O);
  if (!slots) {
    slots = {};
    channel.set(O, slots);
  }
  slots[`$${slot}`] = V;
};
const assert = (O: WeakKey, slot: string) => {
  check(O, slot);
  if (!channel.has(O)) {
    throw new TypeError('Side channel does not contain the given key');
  }
  if (!has(O, slot)) {
    throw new TypeError(`"${slot}" is not present on "O"`);
  }
};
module.exports = Object.freeze({ has, get, set, assert });
