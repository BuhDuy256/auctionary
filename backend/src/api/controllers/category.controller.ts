import { Request, Response, NextFunction } from "express";
import * as categoryService from "../../services/category.service";
import { logger } from "../../utils/logger.util";

export const getAllCategories = async (
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await categoryService.getAllCategories();
    response.status(200).json(result);
  } catch (error) {
    logger.error("CategoryController", "Failed to get all categories", error);
    next(error);
  }
};
