import { BadRequestError, NotFoundError } from "../errors";
import * as bidRepository from "../repositories/bid.repository";
import * as productRepository from "../repositories/product.repository";
import * as bidMapper from "../mappers/bid.mapper";
import { PlaceBidResponse } from "../api/dtos/responses/place-bid.type";

export const placeBid = async (
  productId: number,
  userId: number,
  amount: number
): Promise<PlaceBidResponse> => {
  // 1. Validation
  const product = await productRepository.getProductBidInfo(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
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

  // 2. Upsert Auto-Bid (The User's "Proxy Bid")
  await bidRepository.upsertAutoBid(productId, userId, amount);

  // 3. Auction Engine Calculation
  const autoBids = await bidRepository.getAutoBidsByProductId(productId);

  if (autoBids.length === 0) {
    throw new Error("Failed to process bid");
  }

  const winner = autoBids[0];
  const runnerUp = autoBids[1];

  let newPrice = startPrice;

  if (runnerUp) {
    const priceToBeatRunnerUp = Number(runnerUp.max_amount) + stepPrice;
    newPrice = Math.min(priceToBeatRunnerUp, Number(winner.max_amount));
    newPrice = Math.max(newPrice, startPrice);
  } else {
    newPrice = startPrice;
  }

  // 4. Update "Kinetic" State (Bids Table & Product Table)
  const currentHighestBid = await bidRepository.getHighestBid(productId);
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
    await bidRepository.createBid(productId, winner.bidder_id, newPrice);

    // Update Product Table (Price, Winner, Count)
    await productRepository.updateProductBidStats(productId, winner.bidder_id, newPrice);
  }

  return bidMapper.toPlaceBidResponse(
    winner.bidder_id === userId ? "winning" : "outbid",
    newPrice,
    winner.bidder_id
  );
};
