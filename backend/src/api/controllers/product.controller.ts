import { Request, Response, NextFunction } from "express";
import * as productService from "../../services/product.service";
import { logger } from "../../utils/logger.util";
import * as bidService from "../../services/bid.service";
import {
  ProductsSearchQuery,
  CreateProduct,
} from "../dtos/requests/product.schema";

export const searchProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const query = request.query as unknown as ProductsSearchQuery;
    const result = await productService.searchProducts(query);

    response.status(200).json(result);
  } catch (error) {
    logger.error("ProductController", "Failed to search products", error);
    next(error);
  }
};

export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body as CreateProduct;
    const result = await productService.createProduct(body);

    response
      .status(201)
      .message("Product created successfully")
      .json(result);
  } catch (error) {
    logger.error("ProductController", "Failed to create product", error);
    next(error);
  }
};

export const getProductDetail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const userId = request.query.userId ? Number(request.query.userId) : undefined;

    const result = await productService.getProductDetail(productId, userId);
    response.status(200).json(result);
  } catch (error) {
    logger.error("ProductController", "Failed to get product detail", error);
    next(error);
  }
};

export const getProductBidHistory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 20;

    const result = await productService.getProductBidHistory(productId, page, limit);
    response.status(200).json(result);
  } catch (error) {
    logger.error("ProductController", "Failed to get bid history", error);
    next(error);
  }
};

export const getProductQuestions = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const result = await productService.getProductQuestions(productId, page, limit);
    response.status(200).json(result);
  } catch (error) {
    logger.error("ProductController", "Failed to get product questions", error);
    next(error);
  }
};

export const placeBid = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const userId = (request as any).user?.id; // Assuming auth middleware populates this
    const { amount } = request.body as { amount: number }; // In real app, use mapped DTO type

    if (!userId) {
      // Should be caught by auth middleware, but safety check
      throw new Error("User not authenticated");
    }

    const result = await bidService.placeBid(productId, userId, amount);

    // Using generic success message format as per guide
    response
      .status(200)
      .message(result.status === "winning" ? "Bid placed successfully" : "You have been outbid")
      .json(result);
  } catch (error) {
    logger.error("ProductController", "Failed to place bid", error);
    next(error);
  }
};