import db from "../database/db";

/**
 * Get seller dashboard statistics
 */
export const getSellerStats = async (sellerId: number) => {
  // Active auctions count
  const activeAuctions = await db("products")
    .where({ seller_id: sellerId, status: "active" })
    .where("end_time", ">", new Date())
    .count("id as count")
    .first();

  // Total bids across all seller's products
  const totalBidsResult = await db("products")
    .where({ seller_id: sellerId })
    .sum("bid_count as total")
    .first();

  // Total revenue from sold products
  const totalRevenueResult = await db("orders")
    .where({ seller_id: sellerId })
    .whereIn("status", ["completed", "pending", "shipped"])
    .sum("final_price as total")
    .first();

  // Calculate average bid time (time between auction start and first bid)
  // This is a simplified calculation - you may want to adjust based on business logic
  const avgBidTimeResult = await db("bids")
    .join("products", "bids.product_id", "products.id")
    .where("products.seller_id", sellerId)
    .select(
      db.raw(
        "AVG(EXTRACT(EPOCH FROM (bids.created_at - products.created_at)) / 86400) as avg_days"
      )
    )
    .first();

  return {
    activeAuctions: Number(activeAuctions?.count || 0),
    totalBids: Number(totalBidsResult?.total || 0),
    totalRevenue: Number(totalRevenueResult?.total || 0),
    avgBidTime: Number(avgBidTimeResult?.avg_days || 0),
  };
};

/**
 * Get seller's product listings for dashboard
 */
export const getSellerListings = async (sellerId: number) => {
  const listings = await db("products")
    .leftJoin("categories", "products.category_id", "categories.category_id")
    .where("products.seller_id", sellerId)
    .select(
      "products.id as id",
      "products.name as title",
      "products.thumbnail_url as thumbnailUrl",
      "categories.name as categoryName",
      "products.start_price as startPrice",
      "products.current_price as currentPrice",
      "products.bid_count as bidCount",
      "products.end_time as endTime",
      "products.status",
      "products.created_at as createdAt"
    )
    .orderBy("products.created_at", "desc");

  return listings;
};
