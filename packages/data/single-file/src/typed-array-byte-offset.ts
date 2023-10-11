import { uncurryThis, TypedArrayPrototype } from '@nolyfill/shared';

const typedArrayByteOffSet = uncurryThis(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'byteOffset')!.get!);
const g = (value: unknown) => {
  try {
    return typedArrayByteOffSet(value);
  } catch (e) {
    return false;
  }
};

export default g;
