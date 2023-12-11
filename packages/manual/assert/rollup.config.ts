import type { PackageJson } from 'type-fest';

import resolve from 'resolve-pkg';
import fs from 'fs';
import path from 'path';

import { defineConfig } from 'rollup';
import type { IsExternal } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import { minify } from 'rollup-plugin-swc3';

export default defineConfig(async () => {
  const esIteratorHelpersPkgJsonPath = resolve('ljharb-es-iterator-helpers/package.json');
  if (!esIteratorHelpersPkgJsonPath) {
    throw new Error('Could not find ljharb-es-iterator-helpers/package.json');
  }
  const selfPkgJsonPath = path.resolve('./package.json');

  const selfPksJson = JSON.parse(await fs.promises.readFile(selfPkgJsonPath, 'utf-8')) as PackageJson;

  const dependencies = Object.keys(selfPksJson.dependencies || {});
  const external: IsExternal = (id) => {
    return dependencies.some(dep => id === dep || id.startsWith(`${dep}/`));
  };

  await fs.promises.rm(path.resolve('dist'), { recursive: true, force: true });

  return defineConfig({
    input: 'src/index.ts',
    output: {
      format: 'cjs',
      sourcemap: false,
      esModule: false,
      hoistTransitiveImports: false,
      compact: true,
      generatedCode: 'es2015',
      interop: 'compat',
      file: 'dist/assert.js'
    },
    plugins: [
      replace({
        'require(\'call-bind/callBound\')(\'RegExp.prototype.test\')': 'RegExp.prototype.test',
        preventAssignment: false
      }),
      nodeResolve({
        preferBuiltins: false
      }),
      commonjs(),
      alias({
        entries: {
          'object.assign/polyfill': '@nolyfill/object.assign/polyfill',
          'object-is/polyfill': '@nolyfill/object-is/polyfill',
          'is-nan': '@nolyfill/is-nan'
        }
      }),
      minify({
        module: true,
        compress: {
          passes: 2,
          unsafe: true
        },
        mangle: {}
      })
    ],
    external
  });
});
