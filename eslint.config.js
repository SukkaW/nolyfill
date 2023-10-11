'use strict';

module.exports = require('eslint-config-sukka').sukka({
  node: true,
  ts: {
    tsconfigPath: './tsconfig.json'
  }
}, {
  ignores: ['dist', 'packages/es-iterator-helpers/**/*.js', 'packages/tools/cli/bin/nolyfill.js']
}, {
  rules: {
    '@fluffyfox/array/prefer-from': 'off',
    'prefer-object-has-own': 'off'
  }
});
