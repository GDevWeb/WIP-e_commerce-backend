import express from "express";
import {
  authLimiter,
  registerLimiter,
} from "../../../configuration/security.config";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate";
import { RefreshTokenSchema } from "../../../schemas/auth.refresh.schema";
import * as authController from "../controller/auth.controller";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "../schema/auth.schema";

const authRouter = express.Router();

authRouter.post(
  "/register",
  registerLimiter,
  validate(RegisterSchema),
  authController.register
);
authRouter.post(
  "/login",
  authLimiter,
  validate(LoginSchema),
  authController.login
);

authRouter.get("/profile", authMiddleware, authController.getProfile);

authRouter.patch(
  "/profile",
  authMiddleware,
  validate(UpdateProfileSchema),
  authController.updateProfile
);

authRouter.post(
  "/refresh",
  validate(RefreshTokenSchema),
  authController.refreshToken
);

export default authRouter;
