import { builtinModules } from 'module';
// builtinModules is added since Node.js 6

const publicBuiltinIds = new Set(builtinModules);

// Currently, nolyfill targets Node.js >= 12.4.0, so module.isBuiltin is not available
// TODO: use module.isBuiltin when we bump the minimum supported Node.js version of nolyfill
export default function isCore(x: string, _nodeVersion: unknown) {
  // https://github.com/nodejs/node/blob/e0e0b1a70ebf2b7c6c384771e3f746e9236c4737/lib/internal/bootstrap/realm.js#L314
  return (
    publicBuiltinIds.has(x)
    || (
      typeof x === 'string'
      && x.startsWith('node:')
      && publicBuiltinIds.has(x.slice(5))
    )
  );
}
