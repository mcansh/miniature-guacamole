module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/server/", "/store/reducer.ts"]
};
