import db from "../database/db";

/**
 * Get all users with their roles for admin management
 * Returns raw DB data in snake_case
 */
export const getAllUsers = async () => {
  return await db("users")
    .leftJoin("users_roles", "users.id", "users_roles.user_id")
    .leftJoin("roles", "users_roles.role_id", "roles.role_id")
    .select(
      "users.id",
      "users.full_name",
      "users.email",
      "users.status",
      "users.positive_reviews",
      "users.negative_reviews",
      "users.created_at",
      "roles.name as role_name"
    )
    .orderBy("users.id", "desc");
};

/**
 * Get all upgrade requests with user details
 * Returns raw DB data in snake_case with nested user data
 */
export const getAllUpgradeRequests = async () => {
  return await db("upgrade_requests")
    .join("users", "upgrade_requests.user_id", "users.id")
    .select(
      "upgrade_requests.id as request_id",
      "upgrade_requests.user_id",
      "upgrade_requests.status",
      "upgrade_requests.message",
      "upgrade_requests.created_at",
      "upgrade_requests.approved_at",
      "upgrade_requests.expires_at",
      // User fields
      "users.id as user_id",
      "users.full_name as user_full_name",
      "users.email as user_email",
      "users.positive_reviews as user_positive_reviews",
      "users.negative_reviews as user_negative_reviews",
      "users.created_at as user_created_at"
    )
    .orderBy("upgrade_requests.created_at", "desc");
};

/**
 * Approve an upgrade request
 * Updates status to 'approved' and sets approved_at timestamp
 */
export const approveUpgradeRequest = async (requestId: number) => {
  const [result] = await db("upgrade_requests")
    .where({ id: requestId })
    .update({
      status: "approved",
      approved_at: db.fn.now(),
    })
    .returning(["id", "user_id", "status", "approved_at"]);

  return result;
};

/**
 * Reject an upgrade request
 * Updates status to 'rejected'
 */
export const rejectUpgradeRequest = async (requestId: number) => {
  const [result] = await db("upgrade_requests")
    .where({ id: requestId })
    .update({
      status: "rejected",
    })
    .returning(["id", "user_id", "status"]);

  return result;
};

/**
 * Get a single upgrade request by ID
 * Used for validation before approve/reject
 */
export const findUpgradeRequestById = async (requestId: number) => {
  return await db("upgrade_requests").where({ id: requestId }).first();
};

/**
 * Suspend a user account
 * Updates user status to 'suspended'
 */
export const suspendUser = async (userId: number) => {
  const [result] = await db("users")
    .where({ id: userId })
    .update({
      status: "suspended",
    })
    .returning(["id", "status"]);

  return result;
};

/**
 * Get user by ID
 * Used for validation before suspend
 */
export const findUserById = async (userId: number) => {
  return await db("users").where({ id: userId }).first();
};

/**
 * Get role ID by role name
 * Used to find seller role ID for assignment
 */
export const getRoleIdByName = async (roleName: string) => {
  const role = await db("roles").where({ name: roleName }).first();
  return role ? role.id : null;
};

/**
 * Assign a role to a user
 * Inserts into users_roles table
 */
export const assignRoleToUser = async (userId: number, roleId: number) => {
  // Check if role already assigned
  const existing = await db("users_roles")
    .where({ user_id: userId, role_id: roleId })
    .first();

  if (existing) {
    return existing; // Role already assigned
  }

  const [result] = await db("users_roles")
    .insert({
      user_id: userId,
      role_id: roleId,
    })
    .returning("*");

  return result;
};

/**
 * Update user status by ID
 * Used to change user status (e.g., pending_upgrade -> active)
 */
export const updateUserStatus = async (userId: number, status: string) => {
  const [result] = await db("users")
    .where({ id: userId })
    .update({ status })
    .returning(["id", "status"]);

  return result;
};

/**
 * Get all products with seller, category, and highest bidder details
 * Returns raw DB data in snake_case with JOINs
 */
export const getAllProducts = async () => {
  return await db("products")
    .join("users as seller", "products.seller_id", "seller.id")
    .join("categories", "products.category_id", "categories.category_id")
    .leftJoin(
      "users as highest_bidder",
      "products.highest_bidder_id",
      "highest_bidder.id"
    )
    .select(
      // Product fields
      "products.id as product_id",
      "products.name",
      "products.current_price",
      "products.bid_count",
      "products.status",
      "products.end_time",
      "products.thumbnail_url",
      "products.created_at",
      // Seller fields
      "seller.id as seller_id",
      "seller.full_name as seller_name",
      // Category fields
      "categories.category_id",
      "categories.name as category_name",
      "categories.slug as category_slug",
      // Highest bidder fields (nullable)
      "highest_bidder.id as highest_bidder_id",
      "highest_bidder.full_name as highest_bidder_name"
    )
    .orderBy("products.created_at", "desc");
};

/**
 * Remove a product by ID
 * Updates product status to 'removed'
 */
export const removeProduct = async (productId: number) => {
  const [result] = await db("products")
    .where({ id: productId })
    .update({
      status: "removed",
    })
    .returning(["id", "name", "status"]);

  return result;
};

/**
 * Find product by ID
 * Used for validation before removal
 */
export const findProductById = async (productId: number) => {
  return await db("products").where({ id: productId }).first();
};

/**
 * Get admin overview statistics
 * Returns aggregated counts for bidders, sellers, auctions, and revenue
 */
export const getOverviewStats = async () => {
  // Get total unique bidders
  const biddersResult = await db("users_roles")
    .countDistinct("user_id as total_bidders")
    .where({ role_id: 3 })
    .first();

  // Get total unique sellers
  const sellersResult = await db("users_roles")
    .countDistinct("user_id as total_sellers")
    .where({ role_id: 2 })
    .first();

  // Get total auctions (all statuses)
  const auctionsResult = await db("products")
    .count("* as total_auctions")
    .first();

  // Get total revenue (completed orders only)
  const revenueResult = await db("orders")
    .sum("final_price as total_revenue")
    .where({ status: "completed" })
    .first();

  return {
    total_bidders: biddersResult?.total_bidders || 0,
    total_sellers: sellersResult?.total_sellers || 0,
    total_auctions: auctionsResult?.total_auctions || 0,
    total_revenue: revenueResult?.total_revenue || 0,
  };
};

/**
 * Get recent auctions (last 5 products)
 * Returns products with seller and category details, all statuses
 */
export const getRecentAuctions = async () => {
  return await db("products")
    .join("users", "products.seller_id", "users.id")
    .join("categories", "products.category_id", "categories.category_id")
    .select(
      "products.id as id",
      "products.name as title",
      "categories.name as category",
      "products.thumbnail_url as thumbnail",
      "users.full_name as seller",
      "products.created_at as time"
    )
    .orderBy("products.created_at", "desc")
    .limit(5);
};

/**
 * Get count of pending upgrade requests
 * Returns count of seller upgrade requests with pending status
 */
export const getPendingApprovalsCount = async () => {
  const result = await db("upgrade_requests")
    .count("* as seller_requests")
    .where({ status: "pending" })
    .first();

  return {
    seller_requests: result?.seller_requests || 0,
  };
};
