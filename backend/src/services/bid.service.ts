import * as bidRepository from "../repositories/bid.repository";
import * as userRepository from "../repositories/user.repository";
import * as productRepository from "../repositories/product.repository";
import { ForbiddenError, NotFoundError } from "../errors";
import { BID_CONSTANTS } from "../utils/constant.util";
import { BidHistoryItem, HighestBidder } from "../types/bid.types";
import { maskName } from "../utils/mask.util";
import prisma from "../database/prisma";
import { PaginatedResult } from "../types/product.types";
import { placeBidSchema, getBidHistorySchema } from "../api/schemas/bid.schema";

const validateBidderRating = async (bidderId: number): Promise<void> => {
  const reviews = await userRepository.getPositiveNegativeReviewsById(bidderId);
  if (!reviews) {
    throw new NotFoundError("User not found");
  }

  const { positiveReviews, negativeReviews } = reviews;
  const totalReviews = positiveReviews + negativeReviews;

  if (totalReviews > BID_CONSTANTS.MIN_RATING_REVIEWS) {
    const ratingPercent = positiveReviews / totalReviews;
    if (ratingPercent < BID_CONSTANTS.MIN_RATING_PERCENT) {
      throw new ForbiddenError("Rating percentage is too low to place a bid");
    }
  }
};

const calculateMinBidAmount = (
  startPrice: number,
  currentPrice: number,
  stepPrice: number
): number => {
  return Math.max(startPrice, currentPrice + stepPrice);
};

const handleFirstBid = async (
  productId: number,
  bidderId: number,
  placedMaxPrice: number,
  startPrice: number
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    await tx.auto_bids.create({
      data: {
        product_id: productId,
        bidder_id: bidderId,
        max_amount: placedMaxPrice,
      },
    });

    await tx.products.update({
      where: { product_id: productId },
      data: {
        current_price: startPrice,
        highest_bidder_id: bidderId,
        bid_count: { increment: 1 },
      },
    });

    await tx.bids.create({
      data: {
        product_id: productId,
        bidder_id: bidderId,
        amount: startPrice,
      },
    });
  });
};

const handleExistingBid = async (
  productId: number,
  bidderId: number,
  placedMaxPrice: number,
  highestBidderId: number,
  highestBidderMaxPrice: number,
  stepPrice: number,
  currentPrice: number
): Promise<void> => {
  const existingBidderMaxPrice = await bidRepository.getMaxPriceByBidderId(
    productId,
    bidderId
  );

  if (bidderId === highestBidderId) {
    if (placedMaxPrice > highestBidderMaxPrice) {
      await bidRepository.updateMaxPrice(productId, bidderId, placedMaxPrice);
    }
    return;
  }

  await prisma.$transaction(async (tx) => {
    let newCurrentPrice: number;
    let newHighestBidderId: number;

    if (placedMaxPrice >= highestBidderMaxPrice + stepPrice) {
      newCurrentPrice = highestBidderMaxPrice + stepPrice;
      newHighestBidderId = bidderId;
    } else {
      newCurrentPrice = Math.max(placedMaxPrice, currentPrice);
      newHighestBidderId = highestBidderId;
    }

    await tx.products.update({
      where: { product_id: productId },
      data: {
        current_price: newCurrentPrice,
        highest_bidder_id: newHighestBidderId,
        bid_count: { increment: 1 },
      },
    });

    await tx.bids.create({
      data: {
        product_id: productId,
        bidder_id: newHighestBidderId,
        amount: newCurrentPrice,
      },
    });

    const newStoredMax = Math.max(existingBidderMaxPrice ?? 0, placedMaxPrice);
    await tx.auto_bids.upsert({
      where: {
        product_id_bidder_id: {
          product_id: productId,
          bidder_id: bidderId,
        },
      },
      update: {
        max_amount: newStoredMax,
      },
      create: {
        product_id: productId,
        bidder_id: bidderId,
        max_amount: newStoredMax,
      },
    });
  });
};

export const getHighestBidById = async (
  productId: number
): Promise<HighestBidder | null> => {
  return await bidRepository.findHighestBidById(productId);
};

export const placeBid = async (body: any): Promise<void> => {
  const {
    productId,
    bidderId,
    maxAmount: placedMaxPrice,
  } = placeBidSchema.parse(body);

  await validateBidderRating(bidderId);

  const productBidInfo = await productRepository.getProductBidInfo(productId);
  const { stepPrice, startPrice, currentPrice, highestBidderId } =
    productBidInfo;

  const minBidAmount = calculateMinBidAmount(
    startPrice,
    currentPrice,
    stepPrice
  );
  if (placedMaxPrice < minBidAmount) {
    throw new ForbiddenError(
      `Placed Max Bid Price must be at least ${minBidAmount}`
    );
  }

  if (highestBidderId === null) {
    await handleFirstBid(productId, bidderId, placedMaxPrice, startPrice);
    return;
  }

  const highestBidderMaxPrice = await bidRepository.getMaxPriceByBidderId(
    productId,
    highestBidderId
  );
  await handleExistingBid(
    productId,
    bidderId,
    placedMaxPrice,
    highestBidderId,
    highestBidderMaxPrice,
    stepPrice,
    currentPrice
  );
};

export const getBidHistory = async (
  params: any,
  query: any
): Promise<PaginatedResult<BidHistoryItem>> => {
  const productId = Number(params.id);
  const { page, limit } = getBidHistorySchema.parse(query);
  const history = await bidRepository.findBidHistoryByProductId(
    productId,
    page,
    limit
  );

  const maskedData = history.data.map((item) => ({
    ...item,
    bidderName: maskName(item.bidderName),
  }));

  return {
    data: maskedData,
    pagination: history.pagination,
  };
};
