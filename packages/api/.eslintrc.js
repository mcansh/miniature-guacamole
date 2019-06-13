const path = require('path');

module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
    tsconfigRootDir: './',
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
};
