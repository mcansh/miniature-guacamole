const path = require('path');

module.exports = {
  extends: [
    'mcansh/typescript',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    useJSXTextNode: true,
    project: path.join(__dirname, 'tsconfig.json'),
    tsconfigRootDir: './',
  },
  settings: {
    typescript: {},
    'import/resolver': { 'babel-plugin-root-import': {} },
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
  },
  overrides: {
    files: ['*.js', '.*.js'],
    rules: { '@typescript-eslint/no-var-requires': 'off' },
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'arrow-body-style': ['error', 'as-needed'],
    'promise/prefer-await-to-callbacks': 'off',
    'promise/prefer-await-to-then': 'off',
  },
};
