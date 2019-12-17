module.exports = {
  extends: ['@mcansh/eslint-config/typescript'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '@types/@testing-library/jest-dom.d.ts',
          'test-utils/index.tsx',
          'stylelint.config.js',
          'prettier.config.js',
        ],
      },
    ],
  },
};
