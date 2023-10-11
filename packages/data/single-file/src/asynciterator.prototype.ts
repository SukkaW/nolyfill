// @ts-expect-error -- AsyncIterator is not a real global value, just a mock
const asyncIterProto = typeof AsyncIterator === 'function' ? AsyncIterator.prototype : {};
if (!(Symbol.iterator in asyncIterProto)) {
  asyncIterProto[Symbol.iterator] = function () { return this; };
}

export default asyncIterProto;
