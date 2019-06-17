const { join } = require('path');

const tsconfigRootDir = join(__dirname);
const tsconfig = join(tsconfigRootDir, 'tsconfig.json');

module.exports = {
  extends: [
    'mcansh/typescript',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    project: tsconfig,
    tsconfigRootDir,
  },
  settings: {
    'import/resolver': {
      typescript: { directory: tsconfigRootDir },
    },
  },
  overrides: {
    files: ['*.js', '.*.js'],
    rules: { '@typescript-eslint/no-var-requires': 'off' },
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'arrow-body-style': ['error', 'as-needed'],
    'import/no-extraneous-dependencies': 'off',
  },
};
