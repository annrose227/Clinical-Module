module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "middleware/**/*.js",
    "services/**/*.js",
    "!server.js",
  ],
  setupFilesAfterEnv: [],
  verbose: true,
};
