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
    ecmaFeatures: { jsx: true },
    useJSXTextNode: true,
    project: tsconfig,
    tsconfigRootDir,
  },
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {},
      typescript: { directory: tsconfigRootDir },
    },
  },
  overrides: [
    {
      files: ['*.js', '.*.js'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'arrow-body-style': ['error', 'as-needed'],
    'jsx-a11y/label-has-for': 'off', // Deprecated in 6.1.0 in favor of `jsx-a11y/label-has-associated-control`
    'jsx-a11y/label-has-associated-control': 'error',
  },
};
