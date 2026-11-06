module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setup-env.js"],
  collectCoverageFrom: [
    "controllers/api/**/*.js",
    "middleware/**/*.js",
    "services/**/*.js",
    "utils/**/*.js",
    "!middleware/request.middleware.js",
  ],
  coverageDirectory: "coverage",
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "reports", outputName: "jest-junit.xml" }],
  ],
};
