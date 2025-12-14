import { Request, Response, NextFunction } from "express";
import * as homeService from "../../services/home.service";

/**
 * Get home page sections
 * GET /home/sections
 * Public endpoint - no authentication required
 */
export const getHomeSections = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await homeService.getHomeSections();
    res.status(200).message("Home sections retrieved successfully").json(data);
  } catch (error) {
    next(error);
  }
};
