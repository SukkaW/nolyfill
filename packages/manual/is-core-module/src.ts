import { builtinModules } from 'module';

declare const __INJECTED_CORE_MODULES__: string[];

const mods = __INJECTED_CORE_MODULES__;
const data = new Set(mods.concat(builtinModules, builtinModules.map(x => `node:${x}`)));
const isCore = (x: string, _nodeVersion?: any) => data.has(x);
export default isCore;
