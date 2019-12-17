module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/server/', '/store/reducer.ts'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svg.js',
    '~/(.*)': '<rootDir>/$1',
  },
};
