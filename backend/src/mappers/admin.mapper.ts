import type {
  AdminUserListItem,
  UpgradeRequestListItem,
  UpgradeRequestUser,
  UpgradeRequestActionResponse,
  SuspendUserResponse,
} from "../api/dtos/responses/admin.type";

/**
 * Map raw DB user data to AdminUserListItem
 * Converts snake_case to camelCase and calculates reputation
 */
export const mapUserToAdminListItem = (user: any): AdminUserListItem => {
  // Calculate reputation percentage
  const totalReviews = user.positive_reviews + user.negative_reviews;
  const reputation =
    totalReviews > 0
      ? Math.round((user.positive_reviews / totalReviews) * 100)
      : null;

  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role, // Already processed from role name (Seller/Bidder)
    status: user.status,
    reputation,
    positiveReviews: user.positive_reviews,
    negativeReviews: user.negative_reviews,
    createdAt: user.created_at,
  };
};

/**
 * Map raw DB upgrade request user data to UpgradeRequestUser
 */
export const mapUpgradeRequestUser = (user: any): UpgradeRequestUser => {
  const totalReviews = user.positive_reviews + user.negative_reviews;
  const reputation =
    totalReviews > 0
      ? Math.round((user.positive_reviews / totalReviews) * 100)
      : null;

  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    reputation,
    positiveReviews: user.positive_reviews,
    negativeReviews: user.negative_reviews,
    createdAt: user.created_at,
  };
};

/**
 * Map raw DB upgrade request data to UpgradeRequestListItem
 */
export const mapUpgradeRequestToListItem = (
  request: any
): UpgradeRequestListItem => {
  return {
    id: request.request_id,
    userId: request.user_id,
    user: mapUpgradeRequestUser(request.user),
    message: request.message,
    status: request.status,
    createdAt: request.created_at,
    approvedAt: request.approved_at,
    expiresAt: request.expires_at,
  };
};

/**
 * Map upgrade request action result
 */
export const mapUpgradeRequestActionResponse = (
  data: any
): UpgradeRequestActionResponse => {
  return {
    id: data.request_id,
    userId: data.user_id,
    status: data.status,
    approvedAt: data.approved_at,
  };
};

/**
 * Map suspend user action result
 */
export const mapSuspendUserResponse = (data: any): SuspendUserResponse => {
  return {
    id: data.id,
    status: data.status,
  };
};
