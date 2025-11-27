/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],

  testMatch: ["**/__tests__/integration/**/*.test.ts"],

  testPathIgnorePatterns: ["/node_modules/"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/*.test.ts",
    "!src/generated/**",
    "!src/__tests__/**",
    "!src/server.ts",
  ],

  coverageDirectory: "coverage/integration",
  coverageReporters: ["text", "lcov", "html"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],

  testTimeout: 30000,

  verbose: true,
};
