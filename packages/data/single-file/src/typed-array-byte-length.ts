import { uncurryThis, TypedArrayPrototype } from '@nolyfill/shared';

const typedArrayByteLength = uncurryThis(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'byteLength')!.get!);
const g = (value: unknown) => {
  try {
    return typedArrayByteLength(value);
  } catch {
    return false;
  }
};

export default g;
