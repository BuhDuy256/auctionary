import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import db from "../database/db";
import * as bidRepository from "../repositories/bid.repository";
import * as productRepository from "../repositories/product.repository";
import * as bidMapper from "../mappers/bid.mapper";
import { PlaceBidResponse } from "../api/dtos/responses/place-bid.type";

export const recalculateAuctionState = async (productId: number, trx: any) => {
  const product = await trx("products").where({ id: productId }).first();
  const stepPrice = Number(product.step_price);
  const startPrice = Number(product.start_price);

  const autoBids = await trx("auto_bids")
    .where({ product_id: productId })
    .orderBy("max_amount", "desc");

  let newWinnerId = null;
  let newCurrentPrice = startPrice;

  if (autoBids.length === 0) {
    // No bidder left
    newWinnerId = null;
    newCurrentPrice = startPrice;
  } else if (autoBids.length === 1) {
    // Only 1 bidder left
    const winner = autoBids[0];
    newWinnerId = winner.bidder_id;
    newCurrentPrice = startPrice;
  } else {
    // More than 1 bidder left
    const winner = autoBids[0]; // Top 1
    const runnerUp = autoBids[1]; // Top 2

    newWinnerId = winner.bidder_id;

    const priceToBeatRunnerUp = Number(runnerUp.max_amount) + stepPrice;

    newCurrentPrice = Math.min(priceToBeatRunnerUp, Number(winner.max_amount));

    newCurrentPrice = Math.max(newCurrentPrice, startPrice);
  }

  await trx("products").where({ id: productId }).update({
    highest_bidder_id: newWinnerId,
    current_price: newCurrentPrice,
    bid_count: autoBids.length,
  });

  if (newWinnerId) {
    await trx("bids").insert({
      product_id: productId,
      bidder_id: newWinnerId,
      amount: newCurrentPrice,
      created_at: new Date(),
    });
  }

  return { newWinnerId, newCurrentPrice };
};

export const rejectBidder = async (
  sellerId: number,
  productId: number,
  bidderId: number,
  reason: string
) => {
  return await db.transaction(async (trx) => {
    // 1. Check Seller
    const product = await productRepository.getProductBidInfo(productId, trx);
    if (!product) throw new NotFoundError("Product not found");
    if (product.seller_id !== sellerId) {
      throw new ForbiddenError("Only seller can reject bidders");
    }

    await bidRepository.addRejection(productId, bidderId, reason, trx);
    await bidRepository.deleteUserAutoBids(productId, bidderId, trx);
    await bidRepository.deleteUserBids(productId, bidderId, trx);

    const result = await recalculateAuctionState(productId, trx);

    return result;
  });
};

export const placeBid = async (
  productId: number,
  userId: number,
  amount: number
): Promise<PlaceBidResponse> => {
  return await db.transaction(async (trx) => {
    const product = await productRepository.getProductBidInfo(productId, trx);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.status !== "active") {
      throw new BadRequestError("Cannot place bid on inactive product");
    }

    // Check if user meets bidder requirements based on product config
    if (product.allow_new_bidder === false) {
      // Fetch user's rating information
      const user = await trx("users")
        .where({ id: userId })
        .select("positive_reviews", "negative_reviews")
        .first();

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const totalReviews = user.positive_reviews + user.negative_reviews;

      // Check if user has no ratings (new bidder)
      if (totalReviews === 0) {
        throw new BadRequestError(
          "This auction does not allow new bidders. You must have at least one rating to participate."
        );
      }

      // Check if user has less than 80% positive rating
      const positivePercentage = (user.positive_reviews / totalReviews) * 100;
      if (positivePercentage < 80) {
        throw new BadRequestError(
          `This auction requires bidders to have at least 80% positive ratings. Your current rating is ${positivePercentage.toFixed(
            1
          )}%.`
        );
      }
    }

    const currentPrice = Number(product.current_price);
    const stepPrice = Number(product.step_price);
    const startPrice = Number(product.start_price);

    let minAcceptableBid = startPrice;
    if (product.highest_bidder_id) {
      minAcceptableBid = currentPrice + stepPrice;
    }

    if (amount < minAcceptableBid) {
      throw new BadRequestError(`Bid must be at least ${minAcceptableBid}`);
    }

    await bidRepository.upsertAutoBid(productId, userId, amount, trx);

    const autoBids = await bidRepository.getAutoBidsByProductId(productId, trx);

    if (autoBids.length === 0) {
      throw new Error("Failed to process bid: No auto bids found");
    }

    const winner = autoBids[0];
    const runnerUp = autoBids[1];

    if (runnerUp && runnerUp.bidder_id === userId) {
      await bidRepository.createBid(
        productId,
        userId,
        Number(runnerUp.max_amount),
        trx
      );

      await productRepository.increaseProductBidCount(productId, trx);
    }

    let newPrice = startPrice;

    if (runnerUp) {
      const priceToBeatRunnerUp = Number(runnerUp.max_amount) + stepPrice;
      newPrice = Math.min(priceToBeatRunnerUp, Number(winner.max_amount));
      newPrice = Math.max(newPrice, startPrice);
    } else {
      newPrice = startPrice;
    }

    newPrice = Math.max(newPrice, currentPrice);

    const currentHighestBid = await bidRepository.getHighestBid(productId, trx);
    let shouldCreateBid = false;

    if (!currentHighestBid) {
      shouldCreateBid = true;
    } else {
      const currentRecordedPrice = Number(currentHighestBid.amount);
      if (newPrice > currentRecordedPrice) {
        shouldCreateBid = true;
      } else if (winner.bidder_id !== currentHighestBid.bidder_id) {
        shouldCreateBid = true;
      }
    }

    if (shouldCreateBid) {
      await bidRepository.createBid(productId, winner.bidder_id, newPrice, trx);

      await productRepository.updateProductBidStats(
        productId,
        winner.bidder_id,
        newPrice,
        trx
      );
    }

    const bidCount = await productRepository.getProductBidCount(productId, trx);

    return bidMapper.toPlaceBidResponse(
      winner.bidder_id === userId ? "winning" : "outbid",
      newPrice,
      winner.bidder_id,
      bidCount
    );
  });
};
