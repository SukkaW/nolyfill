import fs from 'fs';
import path from 'path';
import resolve from 'resolve-pkg';

import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { swc } from 'rollup-plugin-swc3';

export default defineConfig(() => {
  const coreJsonPath = resolve('ljharb-is-core-module/package.json');
  if (!coreJsonPath) {
    throw new Error('Could not find ljharb-is-core-module/core.json');
  }
  const coreJson = JSON.parse(fs.readFileSync(path.resolve(coreJsonPath, '../core.json'), 'utf-8')) as string[];

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
        __INJECTED_CORE_MODULES__: JSON.stringify(Object.keys(coreJson)),
        preventAssignment: true
      })
    ]
  });
});
