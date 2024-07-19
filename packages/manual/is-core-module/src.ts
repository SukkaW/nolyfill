import { builtinModules } from 'module';

declare const __INJECTED_CORE_MODULES__: string[];

const data = new Set(builtinModules.concat(builtinModules.map(x => `node:${x}`)).concat(__INJECTED_CORE_MODULES__));
const isCore = (x: string, _nodeVersion?: any) => data.has(x);
export default isCore;
