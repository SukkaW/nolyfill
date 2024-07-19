import fs from 'fs';
import path from 'path';
import resolve from 'resolve-pkg';

import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { swc } from 'rollup-plugin-swc3';

import { builtinModules } from 'module';

export default defineConfig(() => {
  const coreJsonPath = resolve('ljharb-is-core-module/package.json');
  if (!coreJsonPath) {
    throw new Error('Could not find ljharb-is-core-module/core.json');
  }
  const coreJson = JSON.parse(fs.readFileSync(path.resolve(coreJsonPath, '../core.json'), 'utf-8')) as Record<string, boolean | string | string[]>;

  const coreModules = Object.entries(coreJson).reduce<string[]>((acc, [key, value]) => {
    // this excludes all dropped core modules (e.g. buffer_ieee754)
    if (versionIncluded('999999.999999.999999', value)) {
      acc.push(key);
    }

    return acc;
  }, []);

  const builtinModulesWithNodePrefix = builtinModules.concat(builtinModules.map(x => `node:${x}`));
  for (const x of builtinModulesWithNodePrefix) {
    if (!coreModules.includes(x)) {
      console.warn(`[${x}] is a builtin module, but not included in core.json`);
    }
  }

  const builtinModulesWithNodePrefixSet = new Set(builtinModulesWithNodePrefix);
  const injectedModules = coreModules.filter(x => !builtinModulesWithNodePrefixSet.has(x));

  return defineConfig({
    input: './src.ts',
    output: {
      file: './index.js',
      format: 'cjs',
      sourcemap: false,
      esModule: false,
      hoistTransitiveImports: false,
      compact: true,
      generatedCode: 'es2015',
      interop: 'compat'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      swc({
        minify: true,
        jsc: {
          minify: {
            module: true,
            compress: {
              passes: 2,
              unsafe: true
            },
            mangle: {}
          }
        }
      }),
      replace({
        __INJECTED_CORE_MODULES__: JSON.stringify(injectedModules),
        preventAssignment: true
      })
    ]
  });
});

/** is-core-module version range parser */

function specifierIncluded(current: string, specifier: string) {
  const nodeParts = current.split('.');
  const parts = specifier.split(' ');
  const op = parts.length > 1 ? parts[0] : '=';
  const versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

  for (let i = 0; i < 3; ++i) {
    const cur = Number.parseInt(nodeParts[i] || '0', 10);
    const ver = Number.parseInt(versionParts[i] || '0', 10);
    if (cur === ver) {
      continue;
    }
    if (op === '<') {
      return cur < ver;
    }
    if (op === '>=') {
      return cur >= ver;
    }
    return false;
  }
  return op === '>=';
}

function matchesRange(current: string, range: string) {
  const specifiers = range.split(/ ?&& ?/);
  if (specifiers.length === 0) {
    return false;
  }
  for (let i = 0; i < specifiers.length; ++i) {
    if (!specifierIncluded(current, specifiers[i])) {
      return false;
    }
  }
  return true;
}

function versionIncluded(current: string, specifierValue: string[] | boolean | string) {
  if (typeof specifierValue === 'boolean') {
    return specifierValue;
  }

  if (Array.isArray(specifierValue)) {
    for (let i = 0; i < specifierValue.length; i++) {
      if (matchesRange(current, specifierValue[i])) {
        return true;
      }
    }
    return false;
  }

  return matchesRange(current, specifierValue);
}
