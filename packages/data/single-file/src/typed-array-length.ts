import { uncurryThis, TypedArrayPrototype, type TypedArray } from '@nolyfill/shared';

const typedArrayLength = uncurryThis<(this: TypedArray) => number>(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'length')!.get!);
function g(value: TypedArray): number
function g(value: unknown): false
function g(value: unknown) {
  try {
    return typedArrayLength(value as TypedArray);
  } catch {
    return false;
  }
};

export default g;
