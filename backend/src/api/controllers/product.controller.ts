import { Request, Response, NextFunction } from "express";
import * as productService from "../../services/product.service";
import { logger } from "../../utils/logger.util";
import * as bidService from "../../services/bid.service";
import {
  CreateProduct,
  ProductsSearchQuery,
  AppendProductDescription,
  AppendProductQuestion,
  AppendProductAnswer,
  UpdateProductConfig,
} from "../dtos/requests/product.schema";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number | string;
    roles?: string[];
    permissions?: string[];
  };
}

export const searchProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const query = request.query as unknown as ProductsSearchQuery;
    const userId = (request as AuthenticatedRequest).user?.id;
    const result = await productService.searchProducts(query, userId);

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
    const files = (request.files as Express.Multer.File[]) || [];
    const body = request.body;

    const productData: CreateProduct = {
      name: body.name,
      categoryId: Number(body.categoryId),
      sellerId:
        (request as any).user?.id || body.sellerId ? Number(body.sellerId) : 1,
      thumbnailUrl: "", // Service handles this
      imageUrls: [], // Service handles this
      startPrice: Number(body.startPrice),
      stepPrice: Number(body.stepPrice),
      buyNowPrice: body.buyNowPrice ? Number(body.buyNowPrice) : undefined,
      description: body.description,
      endTime: new Date(body.endTime),
      autoExtend: body.autoExtend === "true" || body.autoExtend === true,
      allowNewBidder:
        body.allowNewBidder === "true" || body.allowNewBidder === true,
    };

    const result = await productService.createProduct(productData, files);

    response.status(201).json({
      success: true,
      data: result,
    });
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
    // Get userId from authenticated user if available
    const userId = (request as AuthenticatedRequest).user?.id
      ? Number((request as AuthenticatedRequest).user?.id)
      : undefined;

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

    const result = await productService.getProductBidHistory(
      productId,
      page,
      limit
    );
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

    const result = await productService.getProductQuestions(
      productId,
      page,
      limit
    );
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
      .message(
        result.status === "winning"
          ? "Bid placed successfully"
          : "You have been outbid"
      )
      .json(result);
  } catch (error) {
    next(error);
  }
};

export const appendDescription = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const body = request.body as AppendProductDescription;

    // Safety check for user mismatch if needed, though permission check handles role
    // Ideally we should verify if request.user.id === body.sellerId or if admin

    await productService.appendProductDescription(productId, body);

    response
      .status(200)
      .message("Description appended successfully")
      .json(null);
  } catch (error) {
    logger.error("ProductController", "Failed to append description", error);
    next(error);
  }
};

export const appendQuestion = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const body = request.body as AppendProductQuestion;

    await productService.appendProductQuestion(productId, body);

    response.status(200).message("Question append successfully").json(null);
  } catch (error) {
    logger.error("ProductController", "Failed to append question", error);
    next(error);
  }
};

export const appendAnswer = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const body = request.body as AppendProductAnswer;

    await productService.appendProductAnswer(productId, body);

    response.status(200).message("Question append successfully").json(null);
  } catch (error) {
    logger.error("ProductController", "Failed to append question", error);
    next(error);
  }
};

export const updateProductConfig = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(request.params.id);
    const body = request.body as UpdateProductConfig;

    await productService.updateProductConfig(productId, body);

    response
      .status(200)
      .message("Product config updated successfully")
      .json(null);
  } catch (error) {
    logger.error("ProductController", "Failed to update product config", error);
    next(error);
  }
};

export const rejectBidder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = Number((req as any).user?.id);
    const productId = Number(req.params.id);
    const { bidderId, reason } = req.body;

    if (!bidderId) {
      throw new Error("Bidder ID is required");
    }

    const result = await bidService.rejectBidder(
      sellerId,
      productId,
      bidderId,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Bidder has been rejected and auction recalculated.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
