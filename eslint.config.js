'use strict';

module.exports = require('eslint-config-sukka').sukka({
  node: true,
  ts: true
}, {
  ignores: [
    'dist',
    'packages/es-iterator-helpers/**/*.js',
    'packages/tools/cli/bin/nolyfill.js',
    'packages/generated/**/*.js',
    'packages/generated/**/*.d.ts',
    'packages/generated/*/package.json',
    'packages/tools/cli/src/all-packages.ts',
    'packages/manual/is-core-module/index.js'
  ]
}, {
  rules: {
    '@fluffyfox/array/prefer-from': 'off',
    'prefer-object-has-own': 'off'
  }
}, {
  files: ['packages/data/**/*'],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'sukka/unicorn/new-for-builtins': 'off',
    'sukka/unicorn/no-useless-undefined': 'off', // polyfill match real behavior
    '@typescript-eslint/no-unsafe-function-type': 'off' // we are doing low level stuff
  }
});
