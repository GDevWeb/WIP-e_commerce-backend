// Global setup for tests

// Increase the delay
jest.setTimeout(10000);

// Mock console.log avoiding the spams
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

// .env variables for tests
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-testing-only";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key-for-testing-only";
