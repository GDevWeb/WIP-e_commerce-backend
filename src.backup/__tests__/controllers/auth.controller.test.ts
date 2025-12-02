import { Response } from "express";
import { UnauthorizedError } from "../../errors";
import * as authController from "../../modules/auth/controller/auth.controller";
import * as authService from "../../modules/auth/service/auth.service";
import { AuthRequest } from "../../types/auth.types";
import { mockCustomer } from "../__mocks__/fixtures";
jest.mock("../../modules/auth/service/auth.service");

const mockRequest = (body: any = {}, user: any = null) => {
  const req = {} as AuthRequest;
  req.body = body;
  req.user = user;
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user and return tokens", async () => {
      const registerData = {
        email: "new.user@example.com",
        password: "password123",
        first_name: "New",
        last_name: "User",
      };
      const req = mockRequest(registerData);
      const res = mockResponse();
      const authResponse = {
        accessToken: "access_token",
        refreshToken: "refresh_token",
        user: { ...mockCustomer, ...registerData },
      };
      (authService.register as jest.Mock).mockResolvedValue(authResponse);

      await authController.register(req, res, jest.fn());

      expect(authService.register).toHaveBeenCalledWith(registerData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(authResponse);
    });
  });

  describe("login", () => {
    it("should login a user and return tokens", async () => {
      const loginData = { email: "john.doe@example.com", password: "password" };
      const req = mockRequest(loginData);
      const res = mockResponse();
      const authResponse = {
        accessToken: "access_token",
        refreshToken: "refresh_token",
        user: mockCustomer,
      };
      (authService.login as jest.Mock).mockResolvedValue(authResponse);

      await authController.login(req, res, jest.fn());

      expect(authService.login).toHaveBeenCalledWith(loginData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(authResponse);
    });

    it("should handle login failure", async () => {
      const loginData = { email: "wrong@example.com", password: "wrong" };
      const req = mockRequest(loginData);
      const res = mockResponse();
      const next = jest.fn();
      const error = new UnauthorizedError("Invalid credentials");
      (authService.login as jest.Mock).mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getProfile", () => {
    it("should get the user profile", async () => {
      const user = { userId: 1, role: "USER" };
      const req = mockRequest({}, user);
      const res = mockResponse();
      (authService.getProfile as jest.Mock).mockResolvedValue(mockCustomer);

      await authController.getProfile(req, res, jest.fn());

      expect(authService.getProfile).toHaveBeenCalledWith(user.userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Profile retrieved successfully",
        data: mockCustomer,
      });
    });
  });

  describe("updateProfile", () => {
    it("should update the user profile", async () => {
      const user = { userId: 1, role: "USER" };
      const updatedData = { first_name: "Johnathan" };
      const req = mockRequest(updatedData, user);
      const res = mockResponse();
      const updatedProfile = { ...mockCustomer, ...updatedData };
      (authService.updateProfile as jest.Mock).mockResolvedValue(
        updatedProfile
      );

      await authController.updateProfile(req, res, jest.fn());

      expect(authService.updateProfile).toHaveBeenCalledWith(
        user.userId,
        updatedData
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    });
  });

  describe("refreshToken", () => {
    it("should refresh the access token", async () => {
      const tokenData = { refreshToken: "old_refresh_token" };
      const req = mockRequest(tokenData);
      const res = mockResponse();
      const authResponse = {
        accessToken: "new_access_token",
        refreshToken: "new_refresh_token",
      };
      (authService.refreshTokenAccess as jest.Mock).mockResolvedValue(
        authResponse
      );

      await authController.refreshToken(req, res, jest.fn());

      expect(authService.refreshTokenAccess).toHaveBeenCalledWith(
        tokenData.refreshToken
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access token refreshed successfully",
        data: authResponse,
      });
    });
  });
});

// 2025-27-11
//Tests:       1 failed, 5 passed, 6 total
