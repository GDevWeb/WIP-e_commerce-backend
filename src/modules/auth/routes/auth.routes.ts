import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate";
import { RefreshTokenSchema } from "../../../schemas/auth.refresh.schema";
import * as authController from "../controller/auth.controller";
import {
  LoginSchema,
  RegisterSchema,
  UpdateProfileSchema,
} from "../schema/auth.schema";

// ✅ Debug log
console.log("=== DEBUG SCHEMAS ===");
console.log("RefreshTokenSchema defined?", RefreshTokenSchema !== undefined);
console.log("=== FIN DEBUG ===");

const authRouter = express.Router();

authRouter.post(
  "/register",
  (req, res, next) => {
    console.log("🔍 DEBUG Register:");
    console.log("  - req.body:", req.body);
    console.log("  - Content-Type:", req.headers["content-type"]);
    console.log("  - Body is undefined?", req.body === undefined);
    next();
  },
  validate(RegisterSchema),
  authController.register
);
authRouter.post("/login", validate(LoginSchema), authController.login);

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
