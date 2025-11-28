/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Separate unit tests from integration tests
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/integration/"],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/generated/**",
    "!src/__tests__/**",
    "!src/server.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testTimeout: 10000,
  verbose: true,
};
