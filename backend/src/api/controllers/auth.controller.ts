import { Request, Response, NextFunction } from "express";
import * as authService from "../../services/auth.service";
import { logger } from "../../utils/logger.util";
import { AUTH_CONSTANTS } from "../../configs/constants.config";
import {
  SignupSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  GoogleLoginSchema,
  FacebookLoginSchema,
} from "../dtos/requests/auth.schema";
import { envConfig } from "../../configs/env.config";
import { SignupResponse, LoginResponse } from "../dtos/responses/auth.type";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: envConfig.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_MAX_AGE,
  path: "/",
};

interface AuthenticatedRequest extends Request {
  user?: {
    id: number | string;
    roles?: string[];
    permissions?: string[];
  };
}

export const signup = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = request.body as SignupSchema;
    const result = await authService.signupUser(body);

    // Set refresh token cookie
    response.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    response.status(201).json({
      id: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      isVerified: result.user.isVerified,
      message: result.message,
      accessToken: result.accessToken,
    } as SignupResponse);
  } catch (error) {
    logger.error("AuthController", "Failed to signup user", error);
    next(error);
  }
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deviceInfo = request.headers["user-agent"] || "Unknown";
    const ipAddress =
      (request.headers["x-forwarded-for"] as string) || request.ip || "Unknown";
    const body = request.body as LoginSchema;

    const result = await authService.loginUser(body, deviceInfo, ipAddress);

    if ("requiresVerification" in result) {
      response
        .status(200)
        .message("Please verify your email. A new OTP has been sent.")
        .json({
          requiresVerification: true,
          user: result.user,
          accessToken: result.accessToken,
        });
      return;
    }

    response.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    response
      .status(200)
      .message("Login successful")
      .json({
        accessToken: result.accessToken,
        user: result.user,
      } as LoginResponse);
  } catch (error) {
    logger.error("AuthController", "Failed to login user", error);
    next(error);
  }
};

export const refreshToken = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken =
      request.cookies.refreshToken || request.body.refreshToken;

    if (!refreshToken) {
      response.status(401).message("Refresh token not provided").json(null);
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    response.status(200).message("Token refreshed successfully").json(result);
  } catch (error) {
    logger.error("AuthController", "Failed to refresh token", error);
    next(error);
  }
};

export const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken =
      request.cookies.refreshToken || request.body.refreshToken;

    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }

    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    response.status(200).message("Logged out successfully").json(null);
  } catch (error) {
    logger.error("AuthController", "Failed to logout user", error);
    next(error);
  }
};

export const logoutAll = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const req = request as AuthenticatedRequest;

    if (!req.user || !req.user.id) {
      response.status(401).message("Unauthorized").json(null);
      return;
    }

    await authService.logoutAllDevices(req.user.id as any);

    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envConfig.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    response
      .status(200)
      .message("Logged out from all devices successfully")
      .json(null);
  } catch (error) {
    logger.error("AuthController", "Failed to logout from all devices", error);
    next(error);
  }
};

export const getMe = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const req = request as AuthenticatedRequest;

    if (!req.user || !req.user.id) {
      response.status(401).message("Unauthorized").json(null);
      return;
    }

    const user = await authService.getAuthenticatedUser(req.user.id as any);

    response.status(200).message("User data retrieved successfully").json(user);
  } catch (error) {
    logger.error("AuthController", "Failed to get user data", error);
    next(error);
  }
};

export const forgotPassword = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = request.body as ForgotPasswordSchema;
    const result = await authService.requestPasswordReset(body);

    response.status(200).message(result.message).json(null);
  } catch (error) {
    logger.error("AuthController", "Failed to process forgot password", error);
    next(error);
  }
};

export const resetPassword = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = request.body as ResetPasswordSchema;
    const result = await authService.resetPasswordWithOTP(body);

    response.status(200).message(result.message).json(null);
  } catch (error) {
    logger.error("AuthController", "Failed to reset password", error);
    next(error);
  }
};

export const googleLogin = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = request.body as GoogleLoginSchema;
    const result = await authService.loginWithGoogle(
      body,
      request.headers["user-agent"],
      request.ip
    );

    response.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    response.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    } as LoginResponse);
  } catch (error) {
    logger.error("AuthController", "Failed to login with Google", error);
    next(error);
  }
};

export const facebookLogin = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = request.body as FacebookLoginSchema;
    const result = await authService.loginWithFacebook(
      body,
      request.headers["user-agent"],
      request.ip
    );

    response.cookie(
      "refreshToken",
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    response.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    } as LoginResponse);
  } catch (error) {
    logger.error("AuthController", "Failed to login with Facebook", error);
    next(error);
  }
};
