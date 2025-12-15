import { Request, Response, NextFunction } from "express";
import { verifyRecaptchaV2 } from "../../services/recaptcha.service";
import { envConfig } from "../../configs/env.config";
import { AppError, BadRequestError } from "../../errors";

export const validateRecaptchaV2 = async (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  try {
    // Skip reCAPTCHA validation in test/development mode
    if (process.env.SKIP_RECAPTCHA === "true") {
      console.warn("⚠️  reCAPTCHA validation skipped (SKIP_RECAPTCHA=true)");
      return next();
    }

    if (envConfig.NODE_ENV === "development" && !request.body.recaptchaToken) {
      console.warn("reCAPTCHA bypassed in development mode");
      return next();
    }

    const recaptchaToken =
      request.body.recaptchaToken || request.headers["x-recaptcha-token"];

    if (!recaptchaToken) {
      return next(
        new BadRequestError("Please complete the reCAPTCHA verification")
      );
    }

    const result = await verifyRecaptchaV2(recaptchaToken);

    if (!result.success) {
      return next(
        new BadRequestError(
          result.message || "reCAPTCHA verification failed. Please try again."
        )
      );
    }

    next();
  } catch (error) {
    console.error("reCAPTCHA middleware error:", error);
    next(new AppError(500, "Failed to validate reCAPTCHA. Please try again."));
  }
};
