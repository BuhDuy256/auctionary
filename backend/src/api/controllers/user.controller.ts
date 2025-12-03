import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/user.service";
import { formatResponse } from "../../utils/response.util";
import { logger } from "../../utils/logger.util";
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  PaginationSchema,
} from "../schemas/user.schema";

export const getProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const result = await userService.getProfile(userId);
    formatResponse(
      response,
      200,
      result,
      "User profile retrieved successfully"
    );
  } catch (error) {
    logger.error("UserController", "Failed to get user profile", error);
    next(error);
  }
};

export const updateProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const body = request.body as UpdateProfileSchema;
    const result = await userService.updateProfile(userId, body);
    formatResponse(response, 200, result, "User profile updated successfully");
  } catch (error) {
    logger.error("UserController", "Failed to update user profile", error);
    next(error);
  }
};

export const changePassword = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const body = request.body as ChangePasswordSchema;
    await userService.changePassword(userId, body);
    formatResponse(response, 200, null, "Password changed successfully");
  } catch (error) {
    logger.error("UserController", "Failed to change password", error);
    next(error);
  }
};

export const getWatchlist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const { page, limit } = request.query as unknown as PaginationSchema;
    const result = await userService.getWatchlist(userId, page, limit);
    formatResponse(response, 200, result, "Watchlist retrieved successfully");
  } catch (error) {
    logger.error("UserController", "Failed to get watchlist", error);
    next(error);
  }
};

export const getActiveBids = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const { page, limit } = request.query as unknown as PaginationSchema;
    const result = await userService.getActiveBids(userId, page, limit);
    formatResponse(response, 200, result, "Active bids retrieved successfully");
  } catch (error) {
    logger.error("UserController", "Failed to get active bids", error);
    next(error);
  }
};

export const getWonAuctions = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const { page, limit } = request.query as unknown as PaginationSchema;
    const result = await userService.getWonAuctions(userId, page, limit);
    formatResponse(
      response,
      200,
      result,
      "Won auctions retrieved successfully"
    );
  } catch (error) {
    logger.error("UserController", "Failed to get won auctions", error);
    next(error);
  }
};

export const getMyListings = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (request as any).user.id;
    const { page, limit } = request.query as unknown as PaginationSchema;
    const result = await userService.getMyListings(userId, page, limit);
    formatResponse(response, 200, result, "My listings retrieved successfully");
  } catch (error) {
    logger.error("UserController", "Failed to get my listings", error);
    next(error);
  }
};
