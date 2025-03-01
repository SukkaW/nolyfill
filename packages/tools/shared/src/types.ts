export type TypedArray =
  | BigInt64Array
  | BigUint64Array

  | Float32Array
  | Float64Array
  
  | Int8Array
  | Int16Array
  | Int32Array
  
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array;

export type AnyFunction = (...args: any[]) => any;
