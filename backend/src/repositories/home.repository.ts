import db from "../database/db";

/**
 * Get top 5 auctions ending soon
 * Returns products ordered by end_time ASC (soonest first)
 * Only includes active products
 */
export const getEndingSoonAuctions = async () => {
  return await db("products")
    .join("users as seller", "products.seller_id", "seller.id")
    .leftJoin(
      "users as highest_bidder",
      "products.highest_bidder_id",
      "highest_bidder.id"
    )
    .select(
      // Product fields
      "products.id",
      "products.name",
      "products.thumbnail_url",
      "products.current_price",
      "products.buy_now_price",
      "products.bid_count",
      "products.end_time",
      // Seller fields
      "seller.full_name as seller_name",
      // Top bidder fields (nullable)
      "highest_bidder.full_name as top_bidder_name"
    )
    .where("products.status", "active")
    .orderBy("products.end_time", "asc")
    .limit(5);
};

/**
 * Get top 5 most active auctions
 * Returns products ordered by bid_count DESC (highest bid count first)
 * Only includes active products
 */
export const getMostActiveAuctions = async () => {
  return await db("products")
    .join("users as seller", "products.seller_id", "seller.id")
    .leftJoin(
      "users as highest_bidder",
      "products.highest_bidder_id",
      "highest_bidder.id"
    )
    .select(
      // Product fields
      "products.id",
      "products.name",
      "products.thumbnail_url",
      "products.current_price",
      "products.buy_now_price",
      "products.bid_count",
      "products.end_time",
      // Seller fields
      "seller.full_name as seller_name",
      // Top bidder fields (nullable)
      "highest_bidder.full_name as top_bidder_name"
    )
    .where("products.status", "active")
    .orderBy("products.bid_count", "desc")
    .limit(5);
};

/**
 * Get top 5 highest priced auctions
 * Returns products ordered by current_price DESC (highest price first)
 * Only includes active products
 */
export const getHighestPriceAuctions = async () => {
  return await db("products")
    .join("users as seller", "products.seller_id", "seller.id")
    .leftJoin(
      "users as highest_bidder",
      "products.highest_bidder_id",
      "highest_bidder.id"
    )
    .select(
      // Product fields
      "products.id",
      "products.name",
      "products.thumbnail_url",
      "products.current_price",
      "products.buy_now_price",
      "products.bid_count",
      "products.end_time",
      // Seller fields
      "seller.full_name as seller_name",
      // Top bidder fields (nullable)
      "highest_bidder.full_name as top_bidder_name"
    )
    .where("products.status", "active")
    .orderBy("products.current_price", "desc")
    .limit(5);
};
