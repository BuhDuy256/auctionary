import express from "express";
import * as authController from "../controllers/auth.controller";
import * as otpController from "../controllers/otp.controller";
import { validate } from "../middlewares/validate.middleware";
import { validateRecaptchaV2 } from "../middlewares/recaptcha.middleware";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  facebookLoginSchema,
} from "../dtos/requests/auth.schema";
import { verifyOTPSchema } from "../dtos/requests/otp.schema";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { requirePendingUser } from "../middlewares/require-pending.middleware";

const router = express.Router();

// Public routes with reCAPTCHA v2
router.post(
  "/signup",
  validate(signupSchema),
  validateRecaptchaV2,
  authController.signup
);

router.post(
  "/login",
  validate(loginSchema),
  validateRecaptchaV2,
  authController.login
);

router.post(
  "/google-login",
  validate(googleLoginSchema),
  authController.googleLogin
);

router.post(
  "/facebook-login",
  validate(facebookLoginSchema),
  authController.facebookLogin
);

router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

// OTP routes
router.post(
  "/verify-otp",
  validate(verifyOTPSchema),
  requireAuth,
  requirePendingUser,
  otpController.verifyOTP
);
router.post(
  "/resend-otp",
  requireAuth,
  requirePendingUser,
  otpController.resendOTP
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.get("/me", requireAuth, authController.getMe);
router.post("/logout-all", requireAuth, authController.logoutAll);

export default router;
