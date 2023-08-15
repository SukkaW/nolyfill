import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import fs from 'fs';

import type { PackageJson } from 'type-fest';

export default async () => {
  const dependencies = Object.keys(
    (
      JSON.parse(
        await fs.promises.readFile('package.json', 'utf-8')
      ) as PackageJson
    ).dependencies || {}
  );
  const external = (id: string) => dependencies.some((dep) => dep === id || id.startsWith(`${dep}/`));

  return defineConfig({
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false,
      esModule: false
    },
    plugins: [swc()],
    external
  });
};
