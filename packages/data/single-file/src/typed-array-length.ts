import { uncurryThis, TypedArrayPrototype } from '@nolyfill/shared';

const typedArrayLength = uncurryThis(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'length')!.get!);
const g = (value: unknown) => {
  try {
    return typedArrayLength(value);
  } catch (e) {
    return false;
  }
};

export default g;
