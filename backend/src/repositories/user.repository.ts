import db from "../database/db";

export const createUser = async (userData: {
  full_name: string;
  email: string;
  password?: string | null;
  address?: string | null;
  is_verified?: boolean;
  status?: any;
}) => {
  const [user] = await db("users")
    .insert({
      ...userData,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning("*");
  return user;
};

export const findByEmail = async (email: string) => {
  return await db("users").where({ email }).first();
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

  const otpVerifications = await db("user_otps")
    .where({ user_id: userId, purpose: "signup", consumed_at: null })
    .orderBy("created_at", "desc")
    .limit(1);

  return {
    ...user,
    otpVerifications,
  };
};

export const findById = async (userId: number) => {
  return await db("users").where({ id: userId }).first();
};

export const getPositiveNegativeReviewsById = async (userId: number) => {
  const user = await db("users")
    .where({ id: userId })
    .select("positive_reviews", "negative_reviews")
    .first();

  return user;
};

export const updatePassword = async (
  _userId: number,
  hashedPassword: string
) => {
  return await db("users")
    .where({ id: _userId })
    .update({ password: hashedPassword });
};

export const updateUser = async (userId: number, data: any) => {
  const [user] = await db("users")
    .where({ id: userId })
    .update(data)
    .returning("*");
  return user;
};

export const findByIdWithRoles = async (userId: number) => {
  const user = await db("users").where({ id: userId }).first();
  if (!user) return null;

  // Get user's roles
  const roles = await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.id")
    .where({ user_id: userId })
    .select("roles.name", "roles.id");

  // Get permissions from user's roles
  const permissions = await db("users_roles")
    .join(
      "roles_permissions",
      "users_roles.role_id",
      "roles_permissions.role_id"
    )
    .join("permissions", "roles_permissions.permission_id", "permissions.id")
    .where({ user_id: userId })
    .select("permissions.name")
    .distinct();

  return {
    ...user,
    usersRoles: roles.map((r) => ({ roles: { name: r.name } })),
    usersPermissions: permissions.map((p) => ({
      permissions: { name: p.name },
    })),
  };
};

export const getUserPermissions = async (userId: number): Promise<string[]> => {
  const result = await db("users")
    .join("users_roles", "users.id", "users_roles.user_id")
    .join("roles", "users_roles.role_id", "roles.id")
    .join("roles_permissions", "roles.id", "roles_permissions.role_id")
    .join("permissions", "roles_permissions.permission_id", "permissions.id")
    .where("users.id", userId)
    .select("permissions.name as permission")
    .distinct();

  return result.map((row) => row.permission);
};

export const getUserRoles = async (userId: number): Promise<string[]> => {
  const result = await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.id")
    .where("users_roles.user_id", userId)
    .select("roles.name");

  return result.map((row) => row.name);
};

export const countWonAuctions = async (userId: number): Promise<number> => {
  const result = (await db("transactions")
    .where({ buyer_id: userId })
    .count("id as count")
    .first()) as any;
  return Number(result?.count || 0);
};

export const getActiveBids = async (userId: number) => {
  // Get latest bid for each product this user bid on
  const subquery = db("bids")
    .select("product_id")
    .max("amount as my_max_bid")
    .where("bidder_id", userId)
    .groupBy("product_id")
    .as("my_bids");

  return await db("products")
    .join(subquery, "products.id", "my_bids.product_id")
    .select(
      "products.*",
      "my_bids.my_max_bid",
      db.raw(
        "(SELECT MAX(amount) FROM bids WHERE product_id = products.id) as current_highest_bid"
      ),
      db.raw(
        "(SELECT bidder_id FROM bids WHERE product_id = products.id ORDER BY amount DESC LIMIT 1) as highest_bidder_id"
      )
    );
};

export const getWonAuctions = async (userId: number) => {
  return await db("transactions")
    .join("products", "transactions.product_id", "products.id")
    .where("transactions.buyer_id", userId)
    .select(
      "transactions.*",
      "products.name as product_name",
      "products.thumbnail_url"
    );
};

/**
 * Update user's review score (positive or negative)
 * @param userId - User ID to update
 * @param isPositive - true for positive review, false for negative
 */
export const updateUserReviewScore = async (
  userId: number,
  isPositive: boolean
): Promise<void> => {
  const field = isPositive ? "positive_reviews" : "negative_reviews";

  await db("users").where({ id: userId }).increment(field, 1);
};

/**
 * Get ratings received by a user (as buyer or seller)
 * @param userId - The user whose ratings we want to fetch
 * @param role - Filter by user's role in transaction: "buyer", "seller", or "all"
 * @returns Array of raw rating data with transaction, product, and reviewer info
 */
export const getUserRatings = async (
  userId: number,
  role: "buyer" | "seller" | "all" = "all"
) => {
  const results: any[] = [];

  // Query for ratings when user was the buyer (received from seller)
  if (role === "buyer" || role === "all") {
    const buyerRatings = await db("transactions as t")
      .join("products as p", "t.product_id", "p.id")
      .join("users as seller", "t.seller_id", "seller.id")
      .where("t.buyer_id", userId)
      .where("t.status", "completed")
      .whereNotNull("t.seller_rating")
      .select(
        "t.id as transaction_id",
        "t.seller_rating as rating",
        "t.seller_comment as comment",
        "seller.id as reviewer_id",
        "seller.full_name as reviewer_full_name",
        db.raw("'buyer' as user_role"),
        "t.created_at as transaction_date",
        "t.completed_at",
        "t.updated_at",
        "t.final_price",
        "p.id as product_id",
        "p.name as product_name",
        "p.slug as product_slug",
        "p.thumbnail_url as product_thumbnail_url"
      );
    results.push(...buyerRatings);
  }

  // Query for ratings when user was the seller (received from buyer)
  if (role === "seller" || role === "all") {
    const sellerRatings = await db("transactions as t")
      .join("products as p", "t.product_id", "p.id")
      .join("users as buyer", "t.buyer_id", "buyer.id")
      .where("t.seller_id", userId)
      .where("t.status", "completed")
      .whereNotNull("t.buyer_rating")
      .select(
        "t.id as transaction_id",
        "t.buyer_rating as rating",
        "t.buyer_comment as comment",
        "buyer.id as reviewer_id",
        "buyer.full_name as reviewer_full_name",
        db.raw("'seller' as user_role"),
        "t.created_at as transaction_date",
        "t.completed_at",
        "t.updated_at",
        "t.final_price",
        "p.id as product_id",
        "p.name as product_name",
        "p.slug as product_slug",
        "p.thumbnail_url as product_thumbnail_url"
      );
    results.push(...sellerRatings);
  }

  // Sort by latest timestamp (completed_at, updated_at, or created_at)
  results.sort((a, b) => {
    const getLatestTimestamp = (row: any) => {
      const timestamps = [
        row.completed_at ? new Date(row.completed_at).getTime() : 0,
        row.updated_at ? new Date(row.updated_at).getTime() : 0,
        new Date(row.transaction_date).getTime(),
      ];
      return Math.max(...timestamps);
    };

    return getLatestTimestamp(b) - getLatestTimestamp(a); // DESC order
  });

  return results;
};

/**
 * Get public user profile by ID (excludes sensitive info like email and address)
 * @param userId - User ID to fetch
 * @returns User profile with roles, or null if not found
 */
export const getUserProfileById = async (userId: number) => {
  const user = await db("users")
    .where({ id: userId })
    .select(
      "id",
      "full_name",
      "status",
      "positive_reviews",
      "negative_reviews",
      "created_at"
    )
    .first();

  if (!user) return null;

  // Get user roles
  const roles = await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.id")
    .where({ user_id: userId })
    .select("roles.name");

  return {
    ...user,
    roles: roles.map((r) => r.name),
  };
};

/**
 * Get won auctions for a specific user (public view)
 * @param userId - User ID to fetch won auctions for
 * @returns Array of won auctions with product details
 */
export const getUserWonAuctionsById = async (userId: number) => {
  return await db("transactions")
    .join("products", "transactions.product_id", "products.id")
    .where("transactions.buyer_id", userId)
    .select(
      "transactions.*",
      "products.name as product_name",
      "products.thumbnail_url"
    );
};
