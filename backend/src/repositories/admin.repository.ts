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
      "upgrade_requests.request_id",
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
    .where({ request_id: requestId })
    .update({
      status: "approved",
      approved_at: db.fn.now(),
    })
    .returning(["request_id", "user_id", "status", "approved_at"]);

  return result;
};

/**
 * Reject an upgrade request
 * Updates status to 'rejected'
 */
export const rejectUpgradeRequest = async (requestId: number) => {
  const [result] = await db("upgrade_requests")
    .where({ request_id: requestId })
    .update({
      status: "rejected",
    })
    .returning(["request_id", "user_id", "status"]);

  return result;
};

/**
 * Get a single upgrade request by ID
 * Used for validation before approve/reject
 */
export const findUpgradeRequestById = async (requestId: number) => {
  return await db("upgrade_requests").where({ request_id: requestId }).first();
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
  return role ? role.role_id : null;
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
