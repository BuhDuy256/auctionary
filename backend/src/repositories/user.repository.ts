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
    .select("roles.name", "roles.id as role_id");

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
  const result = (await db("orders")
    .where({ winner_id: userId })
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
  return await db("orders")
    .join("products", "orders.product_id", "products.id")
    .where("orders.winner_id", userId)
    .select(
      "orders.*",
      "products.name as product_name",
      "products.thumbnail_url"
    );
};
