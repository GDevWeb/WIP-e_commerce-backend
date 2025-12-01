import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "../../generated/prisma";

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),
}));

const jwtUtilsMock = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyToken: jest.fn(),
};
jest.mock("../../utils/jwt.utils", () => jwtUtilsMock);

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};
jest.mock("bcrypt", () => bcryptMock);

jest.mock("ms", () => jest.fn(() => 1000 * 60 * 60));

import { UnauthorizedError } from "../../errors";
import * as AuthServiceType from "../../modules/auth/service/auth.service";

describe("AuthService", () => {
  let authService: typeof AuthServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    process.env.BCRYPT_ROUNDS = "10";
    process.env.JWT_REFRESH_EXPIRES_IN = "7d";

    prismaMock = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    authService = require("../../modules/auth/service/auth.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "hashed_password_123",
    first_name: "John",
    last_name: "Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("register", () => {
    const registerInput = {
      email: "test@example.com",
      password: "Password123!",
      first_name: "John",
      last_name: "Doe",
    };

    it("should register a new user and return tokens", async () => {
      bcryptMock.hash.mockResolvedValue("hashed_password_123");
      prismaMock.customer.create.mockResolvedValue(mockUser as any);

      jwtUtilsMock.generateAccessToken.mockReturnValue("access_token");
      jwtUtilsMock.generateRefreshToken.mockReturnValue("refresh_token");

      const result = await authService.register(registerInput);

      expect(bcryptMock.hash).toHaveBeenCalledWith(registerInput.password, 10);
      expect(prismaMock.customer.create).toHaveBeenCalledWith({
        data: {
          email: registerInput.email,
          password: "hashed_password_123", // On vérifie que le mot de passe stocké est hashé
          first_name: registerInput.first_name,
          last_name: registerInput.last_name,
        },
      });

      expect(prismaMock.refreshToken.create).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: "access_token",
        refreshToken: "refresh_token",
        user: expect.objectContaining({
          email: registerInput.email,
        }),
      });
    });
  });

  describe("login", () => {
    const loginInput = {
      email: "test@example.com",
      password: "Password123!",
    };

    it("should login successfully with correct credentials", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(mockUser as any);
      bcryptMock.compare.mockResolvedValue(true); // Le mot de passe correspond

      jwtUtilsMock.generateAccessToken.mockReturnValue("new_access_token");
      jwtUtilsMock.generateRefreshToken.mockReturnValue("new_refresh_token");

      const result = await authService.login(loginInput);

      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { email: loginInput.email },
      });
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        loginInput.password,
        mockUser.password
      );

      expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
      expect(prismaMock.refreshToken.create).toHaveBeenCalled();

      expect(result.accessToken).toBe("new_access_token");
    });

    it("should throw UnauthorizedError if user not found", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginInput)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should throw UnauthorizedError if password does not match", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(mockUser as any);
      bcryptMock.compare.mockResolvedValue(false); // Le mot de passe est faux

      await expect(authService.login(loginInput)).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(mockUser as any);

      const result = await authService.getProfile(1);

      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthorizedError if user not found", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(authService.getProfile(999)).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe("updateProfile", () => {
    it("should update and return user profile", async () => {
      const updateData = { first_name: "Jane" };
      prismaMock.customer.findUnique.mockResolvedValue(mockUser as any); // User exists
      prismaMock.customer.update.mockResolvedValue({
        ...mockUser,
        first_name: "Jane",
      } as any);

      const result = await authService.updateProfile(1, updateData);

      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        select: expect.any(Object),
      });
      expect(result.first_name).toBe("Jane");
    });

    it("should throw UnauthorizedError if user to update is not found", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(authService.updateProfile(999, {})).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe("refreshTokenAccess", () => {
    const oldRefreshToken = "old_refresh_token";

    it("should rotate tokens if refresh token is valid", async () => {
      const decodedToken = { userId: 1 };
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Expire demain

      jwtUtilsMock.verifyToken.mockReturnValue(decodedToken);

      prismaMock.refreshToken.findUnique.mockResolvedValue({
        token: oldRefreshToken,
        userId: 1,
        expiresAt: futureDate,
      } as any);

      prismaMock.customer.findUnique.mockResolvedValue(mockUser as any);

      jwtUtilsMock.generateAccessToken.mockReturnValue("fresh_access_token");
      jwtUtilsMock.generateRefreshToken.mockReturnValue("fresh_refresh_token");

      const result = await authService.refreshTokenAccess(oldRefreshToken);

      expect(prismaMock.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: oldRefreshToken },
      });

      expect(prismaMock.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: oldRefreshToken },
      });

      expect(prismaMock.refreshToken.create).toHaveBeenCalled();

      expect(result.accessToken).toBe("fresh_access_token");
      expect(result.refreshToken).toBe("fresh_refresh_token");
    });

    it("should throw UnauthorizedError if token not found in DB (Revoked)", async () => {
      jwtUtilsMock.verifyToken.mockReturnValue({ userId: 1 });
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);

      await expect(
        authService.refreshTokenAccess(oldRefreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if token is expired in DB", async () => {
      jwtUtilsMock.verifyToken.mockReturnValue({ userId: 1 });

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); //Expired yesterday

      prismaMock.refreshToken.findUnique.mockResolvedValue({
        token: oldRefreshToken,
        userId: 1,
        expiresAt: pastDate,
      } as any);

      await expect(
        authService.refreshTokenAccess(oldRefreshToken)
      ).rejects.toThrow("Refresh token expired");

      // The expired token should be deleted
      expect(prismaMock.refreshToken.delete).toHaveBeenCalled();
    });
  });
});
