import { NextFunction, Request, Response } from "express";
import * as authService from "../../services/auth.service";
import { logger } from "../../utils/logger.util";
import { AUTH_CONSTANTS } from "../../configs/constants.config";
import { envConfig } from "../../configs/env.config";

export const verifyOTP = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { otp } = request.body;
    const userId = (request as any).user.id;

    const result = await authService.verifyOTP(userId, otp);

    response.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE,
    });

    response.status(200).message("Email verified successfully").json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    logger.error("OTPController", "Failed to verify OTP", error);
    next(error);
  }
};

export const resendOTP = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;

    const result = await authService.resendOTP(userId);

    response.status(200).message(result.message).json(null);
  } catch (error) {
    logger.error("OTPController", "Failed to resend OTP", error);
    next(error);
  }
};
