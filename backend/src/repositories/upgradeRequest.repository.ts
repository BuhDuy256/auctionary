import db from "../database/db";

/**
 * Create a new upgrade request
 * Inserts request into upgrade_requests table and returns the created record
 */
export const createUpgradeRequest = async (userId: number, message: string) => {
  const [result] = await db("upgrade_requests")
    .insert({
      user_id: userId,
      message,
      status: "pending",
    })
    .returning("*");

  return result;
};

/**
 * Get user's active upgrade request (pending or approved)
 * Returns null if no active request exists
 */
export const getUserActiveRequest = async (userId: number) => {
  return await db("upgrade_requests")
    .where({ user_id: userId })
    .whereIn("status", ["pending", "approved"])
    .first();
};

/**
 * Cancel an upgrade request
 * Updates status to 'cancelled'
 */
export const cancelUpgradeRequest = async (requestId: number) => {
  const [result] = await db("upgrade_requests")
    .where({ request_id: requestId })
    .update({
      status: "cancelled",
    })
    .returning("*");

  return result;
};

/**
 * Update user status
 * Used to change user status between active and pending_upgrade
 */
export const updateUserStatus = async (
  userId: number,
  status: "active" | "pending_upgrade"
) => {
  const [result] = await db("users")
    .where({ id: userId })
    .update({ status })
    .returning(["id", "status"]);

  return result;
};

/**
 * Get user by ID with verification and review status
 * Used for eligibility validation
 */
export const getUserForEligibilityCheck = async (userId: number) => {
  return await db("users")
    .where({ id: userId })
    .select(
      "id",
      "status",
      "is_verified",
      "positive_reviews",
      "negative_reviews"
    )
    .first();
};

/**
 * Get upgrade request by user ID
 * Used to fetch user's current request
 */
export const getUpgradeRequestByUserId = async (userId: number) => {
  return await db("upgrade_requests")
    .where({ user_id: userId })
    .orderBy("created_at", "desc")
    .first();
};
