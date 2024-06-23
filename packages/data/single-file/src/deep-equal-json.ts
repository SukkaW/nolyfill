import { dequal } from 'dequal';

const deepEqualJSON = (a: any, b: any) => dequal(a, b);
export default deepEqualJSON;
