// Mock Redis Client
export const redisClientMock = {
  isReady: true,
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn(),
  flushAll: jest.fn(),
  quit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  on: jest.fn(),
};

// Reset before each test
beforeEach(() => {
  jest.clearAllMocks();
});

export default redisClientMock;
