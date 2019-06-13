const path = require('path');

module.exports = {
  extends: ['../../.eslintrc.js'],
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
};
