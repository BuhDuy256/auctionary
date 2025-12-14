import type {
  AdminUserListItem,
  UpgradeRequestListItem,
  UpgradeRequestUser,
  UpgradeRequestActionResponse,
  SuspendUserResponse,
  AdminProductListItem,
  AdminProductSeller,
  AdminProductCategory,
  AdminProductHighestBidder,
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

/**
 * Map raw DB product seller data to AdminProductSeller
 */
export const mapProductSeller = (data: any): AdminProductSeller => {
  return {
    id: data.seller_id,
    name: data.seller_name,
  };
};

/**
 * Map raw DB product category data to AdminProductCategory
 */
export const mapProductCategory = (data: any): AdminProductCategory => {
  return {
    id: data.category_id,
    name: data.category_name,
    slug: data.category_slug,
  };
};

/**
 * Map raw DB highest bidder data to AdminProductHighestBidder
 */
export const mapProductHighestBidder = (
  data: any
): AdminProductHighestBidder => {
  return {
    id: data.highest_bidder_id || null,
    name: data.highest_bidder_name || null,
  };
};

/**
 * Map raw DB product data to AdminProductListItem
 * Converts snake_case to camelCase and maps nested objects
 */
export const mapProductToAdminListItem = (
  product: any
): AdminProductListItem => {
  return {
    id: product.product_id,
    title: product.name,
    seller: mapProductSeller(product),
    category: mapProductCategory(product),
    currentBid: parseFloat(product.current_price),
    bids: product.bid_count || 0,
    status: product.status,
    endTime: product.end_time,
    thumbnailUrl: product.thumbnail_url || "",
    createdAt: product.created_at,
    highestBidder: mapProductHighestBidder(product),
  };
};
