import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

// Mock Prisma client
export const prismaMock =
  mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Reset before each test
beforeEach(() => {
  mockReset(prismaMock);
});

export default prismaMock;
