import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import fs from 'fs';
import { builtinModules } from 'module';
import { MagicString } from '@napi-rs/magic-string';

import type { PackageJson } from 'type-fest';

export default async () => {
  const dependencies = Object.keys(
    (
      JSON.parse(
        await fs.promises.readFile('package.json', 'utf-8')
      ) as PackageJson
    ).dependencies || {}
  ).concat(builtinModules);
  const external = (id: string) => dependencies.some((dep) => dep === id || id.startsWith(`${dep}/`));

  return defineConfig({
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false,
      esModule: false
    },
    plugins: [
      nodeResolve({
        exportConditions: ['default', 'module', 'import']
      }),
      commonjs({
        esmExternals: true
      }),
      json(),
      {
        name: 'remove-shebang',
        transform: {
          order: 'pre',
          handler(code) {
            let magicString: MagicString | null = null;

            /**
             * Here we are making 3 assumptions:
             * - shebang can only be at the first line of the file, otherwise it will not be recognized
             * - shebang can only contains one line
             * - shebang must starts with # and !
             *
             * Those assumptions are also made by acorn, babel and swc:
             *
             * - acorn: https://github.com/acornjs/acorn/blob/8da1fdd1918c9a9a5748501017262ce18bb2f2cc/acorn/src/state.js#L78
             * - babel: https://github.com/babel/babel/blob/86fee43f499c76388cab495c8dcc4e821174d4e0/packages/babel-parser/src/tokenizer/index.ts#L574
             * - swc: https://github.com/swc-project/swc/blob/7bf4ab39b0e49759d9f5c8d7f989b3ed010d81a7/crates/swc_ecma_parser/src/lexer/mod.rs#L204
             */
            // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with -- [0] is way faster
            if (code[0] === '#' && code[1] === '!') {
              let firstNewLineIndex = 0;

              for (let i = 2, len = code.length; i < len; i++) {
                const charCode = code.charCodeAt(i);
                if (charCode === 10 || charCode === 13 || charCode === 0x2028 || charCode === 0x2029) {
                  firstNewLineIndex = i;
                  break;
                }
              }

              if (firstNewLineIndex) {
                magicString ||= new MagicString(code);
                magicString.remove(0, firstNewLineIndex + 1);
              }
            }

            return {
              code: magicString ? magicString.toString() : code,
              map: magicString ? magicString.generateMap({ hires: true }).toMap() : null
            };
          }
        }
      },
      swc({
        minify: true,
        jsc: {
          minify: {
            compress: {
              passes: 2
            },
            mangle: true,
            module: true
          }
        }
      })
    ],
    external
  });
};
