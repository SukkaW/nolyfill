import type { PackageJson } from 'type-fest';

import resolve from 'resolve-pkg';
import fs from 'fs';
import path from 'path';

import { defineConfig } from 'rollup';
import type { IsExternal } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
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

  const input = Object.values(esIteratorHelpersPkgJson.exports || {})
    .reduce<Record<string, string>>((acc, curExport) => {
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
  }, {});

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
      chunkFileNames: '[name].js',
      compact: false,
      generatedCode: 'es2015',
      interop: 'auto',
      manualChunks() {
        return 'dist/vendor';
      }
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      minify({
        module: true
      })
    ],
    external
  });
});
