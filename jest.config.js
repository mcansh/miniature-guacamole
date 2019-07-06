module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
    'jest-dom/extend-expect',
  ],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/server/', '/store/reducer.ts'],
};
