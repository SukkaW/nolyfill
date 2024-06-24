import { dequal } from 'dequal/lite';

const deepEqualJSON = (a: any, b: any) => dequal(a, b);
export default deepEqualJSON;
