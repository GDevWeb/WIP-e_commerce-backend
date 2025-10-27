import { Request, Response } from "express";
import { AuthRequest } from "../../../types/auth.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as authService from "../service/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const authResponse = await authService.register(req.body);
  console.log("ℹ️From controller register - value of body:", req.body);

  res.status(201).json(authResponse);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const authResponse = await authService.login(req.body);
  res.status(200).json(authResponse);
});

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const user = await authService.getProfile(userId);

    res.status(200).json({
      message: "Profile retrieved successfully",
      data: user,
    });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const user = await authService.updateProfile(userId, req.body);

    res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const authResponse = await authService.refreshTokenAccess(refreshToken);

    res.status(200).json({
      message: "Access token refreshed successfully",
      data: authResponse,
    });
  }
);
