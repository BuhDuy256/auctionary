import express from "express";
import * as authController from "../controllers/auth.controller";
import * as otpController from "../controllers/otp.controller";
import { validate } from "../../middlewares/validate.middleware";
import { signupSchema, loginSchema } from "../schemas/auth.schema";
import { verifyOTPSchema, resendOTPSchema } from "../schemas/otp.schema";
import { requireAuth } from "../../middlewares/requireAuth.middleware";

const router = express.Router();

// Public routes
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

// OTP routes
router.post("/verify-otp", validate(verifyOTPSchema), otpController.verifyOTP);
router.post("/resend-otp", validate(resendOTPSchema), otpController.resendOTP);

// Protected routes
router.post("/logout-all", requireAuth, authController.logoutAll);

export default router;
