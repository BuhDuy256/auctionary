import { Request, Response, NextFunction } from "express";
import * as sellerService from "../../services/seller.service";
import { logger } from "../../utils/logger.util";

export const getSellerDashboard = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // Get seller ID from authenticated user
    const sellerId = (request as any).user?.id;

    if (!sellerId) {
      response.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await sellerService.getSellerDashboard(sellerId);

    response.status(200).json(result);
  } catch (error) {
    logger.error("SellerController", "Failed to get seller dashboard", error);
    next(error);
  }
};
