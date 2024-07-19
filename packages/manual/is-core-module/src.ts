declare const __INJECTED_CORE_MODULES__: string[];

const data = new Set(__INJECTED_CORE_MODULES__);
export default function isCore(x: string, _nodeVersion?: any) {
  return data.has(x);
}
