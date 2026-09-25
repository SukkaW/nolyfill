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
    'packages/tools/cli/test/fixtures',
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
    '@typescript-eslint/no-unsafe-function-type': 'off', // we are doing low level stuff
    '@typescript-eslint/no-unnecessary-condition': 'off', // built-ins might be missing at runtime, which is why we polyfill
    'sukka/unicorn/no-useless-coercion': 'off', // runtime values don't have to match the declared types (e.g. array-like `this`)
    'sukka/unicorn/no-impossible-length-comparison': 'off', // same as above, `length` of an arbitrary object can be anything
    '@typescript-eslint/no-deprecated': 'off', // we polyfill deprecated APIs as well
    'n/no-deprecated-api': 'off', // we polyfill deprecated APIs as well
    'promise/prefer-catch': 'off' // `.then(a, b)` is not equivalent to `.catch(b).then(a)`, polyfills must match the spec exactly
  }
}, {
  files: ['packages/data/**/*', 'packages/manual/**/*'],
  rules: {
    'sukka/prefer-foxts-noop': 'off' // published packages have zero dependencies
  }
}, {
  files: ['packages/data/es-shim-like/src/promise.any.ts'],
  rules: {
    'vibe-proof/prefer-array-from-mapper': 'off', // drain the iterable first, or an iterator that throws midway leaves the inverted promises as unhandled rejections
    'sukka/unicorn/catch-error-name': 'off' // promises are inverted, the rejection reason is the first fulfilled value
  }
}, {
  files: ['packages/tools/cli/src/lockfile/npm.ts'],
  rules: {
    'import-x/no-named-as-default': 'off' // default export is the class, @types/npmcli__arborist mistypes the named export as an instance
  }
});
