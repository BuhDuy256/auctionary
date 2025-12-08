import { ProductListCardProps, } from "../api/dtos/responses/product.type";
import { toNum } from "../utils/number.util";

export const mapToProductListCard = (product: any): ProductListCardProps => {
  if (!product) {
    throw new Error("Product data is required for mapping");
  }

  const now = Date.now();
  const endTime = new Date(product.end_time).getTime();
  const msLeft = endTime - now;

  let timeLeft = "Ended";
  if (msLeft > 0) {
    const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      timeLeft = `${days}d ${hours}h`;
    } else if (hours > 0) {
      timeLeft = `${hours}h ${minutes}m`;
    } else {
      timeLeft = `${minutes}m`;
    }
  }

  const isNewArrival = Date.now() - new Date(product.created_at).getTime() < 24 * 60 * 60 * 1000;

  return {
    id: product.product_id.toString(),
    slug: product.slug,
    title: product.name,
    image: product.thumbnail_url || "",
    currentBid: toNum(product.current_price),
    buyNowPrice: product.buy_now_price ? toNum(product.buy_now_price) : undefined,
    topBidder: product.bidder_name || "No bids yet",
    timeLeft,
    isNewArrival,
    bidCount: product.bid_count || 0,
  };
};

/**
 * Masks bidder name for privacy (shows last 4-5 chars + "****")
 */
export const maskBidderName = (name: string | null): string => {
  if (!name) return "****";
  const visibleChars = Math.min(5, Math.max(4, name.length - 4));
  const lastChars = name.slice(-visibleChars);
  return `****${lastChars}`;
};

/**
 * Calculates seller rating based on positive and negative reviews
 */
export const calculateSellerRating = (positiveReviews: number, negativeReviews: number) => {
  const total = positiveReviews + negativeReviews;
  if (total === 0) {
    return {
      average: 0,
      totalReviews: 0,
      positivePercentage: 0,
    };
  }

  const average = (positiveReviews / total) * 5;
  const positivePercentage = (positiveReviews / total) * 100;

  return {
    average: Math.round(average * 10) / 10,
    totalReviews: total,
    positivePercentage: Math.round(positivePercentage),
  };
};
