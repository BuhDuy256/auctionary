import db from "../database/db";
import { UpdateProfileSchema } from "../api/schemas/user.schema";

export const findById = async (id: number) => {
  return await db("users").where({ id }).first();
};

export const findByEmail = async (email: string) => {
  return await db("users").where({ email }).first();
};

export const createUser = async (userData: {
  full_name: string;
  email: string;
  password?: string | null;
  address?: string | null;
  is_verified?: boolean;
  status?: any;
}) => {
  const [user] = await db("users").insert(userData).returning("*");
  return user;
};

export const verifyUser = async (userId: number) => {
  const [user] = await db("users")
    .where({ id: userId })
    .update({ is_verified: true, status: "active" })
    .returning("*");
  return user;
};

export const findByIdWithOTP = async (userId: number) => {
  const user = await db("users").where({ id: userId }).first();

  if (!user) return null;

  const otpVerifications = await db("otp_verifications")
    .where({ user_id: userId, is_used: false })
    .orderBy("created_at", "desc")
    .limit(1);

  return {
    ...user,
    otpVerifications,
  };
};

export const getPositiveNegativeReviewsById = async (userId: number) => {
  const user = await db("users")
    .where({ id: userId })
    .select("positive_reviews", "negative_reviews")
    .first();

  return user;
};

export const findByIdWithRoles = async (userId: number) => {
  const user = await db("users").where({ id: userId }).first();
  if (!user) return null;

  const roles = await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.role_id")
    .where({ user_id: userId })
    .select("roles.name");

  return {
    ...user,
    usersRoles: roles.map((r) => ({ roles: { name: r.name } })),
  };
};

export const update = async (
  id: number,
  data: Partial<UpdateProfileSchema>
) => {
  const updateData: any = {};
  if (data.fullName) updateData.full_name = data.fullName;
  if (data.email) updateData.email = data.email;
  if (data.address) updateData.address = data.address;

  const [user] = await db("users")
    .where({ id })
    .update({ ...updateData, updated_at: new Date() })
    .returning("*");
  return user;
};

export const updatePassword = async (id: number, passwordHash: string) => {
  await db("users").where({ id }).update({
    password: passwordHash,
    password_updated_at: new Date(),
    updated_at: new Date(),
  });
};

export const getUserRoles = async (userId: number) => {
  return await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.role_id")
    .where("users_roles.user_id", userId)
    .select("roles.name");
};

export const countWonAuctions = async (userId: number) => {
  const result = await db("orders")
    .where({ winner_id: userId })
    .count("order_id as count")
    .first();
  return Number(result?.count || 0);
};

export const getWatchlist = async (
  userId: number,
  limit: number,
  offset: number
) => {
  return await db("watchlist")
    .join("products", "watchlist.product_id", "products.product_id")
    .where("watchlist.user_id", userId)
    .select(
      "products.product_id as id",
      "products.name as title",
      "products.thumbnail_url as image_url",
      "products.current_price as current_bid",
      "products.end_time",
      "products.bid_count",
      "products.status"
    )
    .limit(limit)
    .offset(offset);
};

export const getActiveBids = async (
  userId: number,
  limit: number,
  offset: number
) => {
  // Get distinct products where user has bid
  // This is a simplified query; for "leading" status we need more complex logic
  // For now, we'll fetch the product info and the user's max bid if auto-bid exists, or their last bid

  // Subquery to find the latest bid per product for this user
  const latestUserBids = db("bids")
    .where("bidder_id", userId)
    .select("product_id")
    .max("amount as my_bid")
    .groupBy("product_id")
    .as("lub");

  return await db("products")
    .join(latestUserBids, "products.product_id", "lub.product_id")
    .select(
      "products.product_id as id",
      "products.name as title",
      "products.current_price as current_bid",
      "lub.my_bid as your_max_bid", // simplified: using last bid as "max bid" proxy if no auto-bid
      "products.highest_bidder_id",
      "products.end_time",
      "products.bid_count"
    )
    .limit(limit)
    .offset(offset);
};

export const getWonAuctions = async (
  userId: number,
  limit: number,
  offset: number
) => {
  return await db("orders")
    .join("products", "orders.product_id", "products.product_id")
    .where("orders.winner_id", userId)
    .select(
      "orders.order_id as id",
      "products.name as title",
      "orders.final_price",
      "orders.created_at as won_date",
      "orders.status"
    )
    .limit(limit)
    .offset(offset);
};

export const getMyListings = async (
  userId: number,
  limit: number,
  offset: number
) => {
  return await db("products")
    .where("seller_id", userId)
    .select(
      "product_id as id",
      "name as title",
      "current_price as current_bid",
      "start_price as starting_price",
      "bid_count",
      "end_time",
      "status"
    )
    .limit(limit)
    .offset(offset);
};
