import type { PackageJson } from 'type-fest';

import resolve from 'resolve-pkg';
import fs from 'fs';
import path from 'path';

import { defineConfig } from 'rollup';
import type { IsExternal } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { minify } from 'rollup-plugin-swc3';

export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- safe
  const esIteratorHelpersPkgJsonPath = resolve('ljharb-es-iterator-helpers/package.json');
  if (!esIteratorHelpersPkgJsonPath) {
    throw new Error('Could not find ljharb-es-iterator-helpers/package.json');
  }
  const selfPkgJsonPath = path.resolve('./package.json');

  const esIteratorHelpersDir = path.dirname(esIteratorHelpersPkgJsonPath);

  const [esIteratorHelpersPkgJson, selfPksJson] = (
    await Promise.all([
      fs.promises.readFile(esIteratorHelpersPkgJsonPath, 'utf-8'),
      fs.promises.readFile(selfPkgJsonPath, 'utf-8')
    ])
  ).map((pkgJson) => JSON.parse(pkgJson) as PackageJson);

  const input = Object.values(esIteratorHelpersPkgJson.exports || {}).reduce<Record<string, string>>(
    (acc, curExport) => {
      if (typeof curExport !== 'string') {
        throw new TypeError(`Unsupported export type: ${typeof curExport}`);
      }

      if (curExport.endsWith('.js')) {
        const realPath = path.resolve(esIteratorHelpersDir, curExport);
        const relativePath = path.relative(esIteratorHelpersDir, realPath);
        const relativePathWithoutExtname = relativePath.slice(0, -path.extname(relativePath).length);

        acc[relativePathWithoutExtname] = realPath;
      }

      return acc;
    }, {}
  );

  const dependencies = Object.keys(selfPksJson.dependencies || {});
  const external: IsExternal = (id) => {
    return dependencies.some(dep => id === dep || id.startsWith(`${dep}/`));
  };

  return defineConfig({
    input,
    output: {
      dir: '.',
      format: 'cjs',
      sourcemap: false,
      esModule: false,
      hoistTransitiveImports: false,
      chunkFileNames: 'dist/[name].js',
      compact: false,
      generatedCode: 'es2015',
      interop: 'auto',
      manualChunks() {
        return 'index';
      }
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      minify({
        module: true,
        compress: {
          passes: 2,
          unsafe: true
        },
        mangle: {}
      }),
      replace({
        'typeof BigInt64Array': JSON.stringify(typeof BigInt64Array),
        'typeof BigUint64Array': JSON.stringify(typeof BigUint64Array),
        'typeof Float32Array': JSON.stringify(typeof Float32Array),
        'typeof Float64Array': JSON.stringify(typeof Float64Array),
        'typeof Int16Array': JSON.stringify(typeof Int16Array),
        'typeof Int32Array': JSON.stringify(typeof Int32Array),
        'typeof Int8Array': JSON.stringify(typeof Int8Array),
        'typeof Uint16Array': JSON.stringify(typeof Uint16Array),
        'typeof Uint32Array': JSON.stringify(typeof Uint32Array),
        'typeof Uint8Array': JSON.stringify(typeof Uint8Array),
        'typeof Uint8ClampedArray': JSON.stringify(typeof Uint8ClampedArray),
        'typeof Map': JSON.stringify(typeof Map),
        'typeof Set': JSON.stringify(typeof Set),
        'typeof WeakMap': JSON.stringify(typeof WeakMap),
        'typeof WeakSet': JSON.stringify(typeof WeakSet),
        'typeof Promise': JSON.stringify(typeof Promise),
        'typeof ArrayBuffer': JSON.stringify(typeof ArrayBuffer),
        'typeof BigInt': JSON.stringify(typeof BigInt),
        'typeof Symbol': JSON.stringify(typeof Symbol),
        'typeof Symbol.toStringTag': JSON.stringify(typeof Symbol.toStringTag),
        'typeof Reflect': JSON.stringify(typeof Reflect),
        'typeof JSON': JSON.stringify(typeof JSON),
        'typeof Proxy': JSON.stringify(typeof Proxy),
        'typeof Symbol.iterator': JSON.stringify(typeof Symbol.iterator),
        'typeof Atomics': JSON.stringify(typeof Atomics),
        'typeof Object.defineProperty': JSON.stringify(typeof Object.defineProperty),
        preventAssignment: true
      })
    ],
    external
  });
});
