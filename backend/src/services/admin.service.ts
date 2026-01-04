import * as adminRepository from "../repositories/admin.repository";
import * as EmailService from "./email.service";
import { envConfig } from "../configs/env.config";
import {
  mapUserToAdminListItem,
  mapUpgradeRequestToListItem,
  mapUpgradeRequestActionResponse,
  mapSuspendUserResponse,
  mapProductToAdminListItem,
  mapAdminOverviewStats,
  mapAdminOverviewRecentAuction,
  mapAdminOverviewPendingApprovals,
  mapAdminOverviewSystemStatus,
} from "../mappers/admin.mapper";
import type {
  AdminUserListResponse,
  UpgradeRequestListResponse,
  UpgradeRequestActionResponse,
  SuspendUserResponse,
  AdminProductListResponse,
  AdminOverviewResponse,
} from "../api/dtos/responses/admin.type";
import { NotFoundError, BadRequestError } from "../errors";

/**
 * Get all users with their roles for admin management
 * Processes role determination (seller/bidder) and transforms to camelCase
 */
export const getAllUsers = async (): Promise<AdminUserListResponse> => {
  const rawUsers = await adminRepository.getAllUsers();

  // Group users by ID and determine their primary role
  const userMap = new Map<number, any>();

  rawUsers.forEach((row) => {
    if (!userMap.has(row.id)) {
      userMap.set(row.id, {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        status: row.status,
        positive_reviews: row.positive_reviews,
        negative_reviews: row.negative_reviews,
        created_at: row.created_at,
        roles: [],
      });
    }

    // Add role if it exists
    if (row.role_name) {
      userMap.get(row.id)!.roles.push(row.role_name);
    }
  });

  // Convert map to array and determine display role
  const users = Array.from(userMap.values()).map((user) => {
    // Determine single role for display: seller > bidder
    let displayRole: "seller" | "bidder" = "bidder"; // default
    if (user.roles.includes("seller")) {
      displayRole = "seller";
    } else if (user.roles.includes("bidder")) {
      displayRole = "bidder";
    }

    return {
      ...user,
      role: displayRole,
    };
  });

  // Map to response format
  const mappedUsers = users.map(mapUserToAdminListItem);

  return {
    users: mappedUsers,
  };
};

/**
 * Get all upgrade requests with user details
 */
export const getAllUpgradeRequests =
  async (): Promise<UpgradeRequestListResponse> => {
    const rawRequests = await adminRepository.getAllUpgradeRequests();

    // Transform raw data to expected structure
    const requests = rawRequests.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      status: row.status,
      message: row.message,
      created_at: row.created_at,
      approved_at: row.approved_at,
      expires_at: row.expires_at,
      user: {
        id: row.user_id,
        full_name: row.user_full_name,
        email: row.user_email,
        positive_reviews: row.user_positive_reviews,
        negative_reviews: row.user_negative_reviews,
        created_at: row.user_created_at,
      },
    }));

    const mappedRequests = requests.map(mapUpgradeRequestToListItem);

    return {
      requests: mappedRequests,
    };
  };

/**
 * Approve an upgrade request
 * Validates the request exists and is pending before approval
 * Updates user role to seller and status to active
 */
export const approveUpgradeRequest = async (
  requestId: number
): Promise<UpgradeRequestActionResponse> => {
  // Validate request exists
  const request = await adminRepository.findUpgradeRequestById(requestId);
  if (!request) {
    throw new NotFoundError("Upgrade request not found");
  }

  // Check if already processed
  if (request.status !== "pending") {
    throw new BadRequestError(`Request has already been ${request.status}`);
  }

  // Approve the request
  const result = await adminRepository.approveUpgradeRequest(requestId);

  // Get seller role ID
  const sellerRoleId = await adminRepository.getRoleIdByName("seller");
  if (!sellerRoleId) {
    throw new Error("Seller role not found in database");
  }

  // Assign seller role to user
  await adminRepository.assignRoleToUser(request.user_id, sellerRoleId);

  // Update user status to active
  await adminRepository.updateUserStatus(request.user_id, "active");

  // TODO: Send email to user

  return mapUpgradeRequestActionResponse(result);
};

/**
 * Reject an upgrade request
 * Validates the request exists and is pending before rejection
 */
export const rejectUpgradeRequest = async (
  requestId: number
): Promise<UpgradeRequestActionResponse> => {
  // Validate request exists
  const request = await adminRepository.findUpgradeRequestById(requestId);
  if (!request) {
    throw new NotFoundError("Upgrade request not found");
  }

  // Check if already processed
  if (request.status !== "pending") {
    throw new BadRequestError(`Request has already been ${request.status}`);
  }

  const result = await adminRepository.rejectUpgradeRequest(requestId);

  await adminRepository.updateUserStatus(request.user_id, "active");

  // TODO: Send email to user

  return mapUpgradeRequestActionResponse(result);
};

/**
 * Suspend a user account
 * Validates the user exists before suspension
 */
export const suspendUser = async (
  userId: number
): Promise<SuspendUserResponse> => {
  // Validate user exists
  const user = await adminRepository.findUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if already suspended
  if (user.status === "suspended") {
    throw new BadRequestError("User is already suspended");
  }

  const result = await adminRepository.suspendUser(userId);
  return mapSuspendUserResponse(result);
};

/**
 * Get all products for admin management
 * Returns products with seller, category, and highest bidder details
 */
export const getAllProducts = async (): Promise<AdminProductListResponse> => {
  const rawProducts = await adminRepository.getAllProducts();

  // Map raw DB data to response format using mapper
  const mappedProducts = rawProducts.map(mapProductToAdminListItem);

  return {
    products: mappedProducts,
  };
};

/**
 * Remove a product
 * Validates the product exists before removal
 * TODO: Add email notification to seller with reason
 */
export const removeProduct = async (productId: number): Promise<void> => {
  // Validate product exists
  const product = await adminRepository.findProductById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Check if already removed
  if (product.status === "removed") {
    throw new BadRequestError("Product is already removed");
  }

  // Update product status to 'removed'
  await adminRepository.removeProduct(productId);

  // TODO: Send email to seller with removal reason
  // await emailService.sendProductRemovedNotification(product.seller_id, reason);
};

/**
 * Get admin overview data
 * Fetches dashboard stats, recent auctions, pending approvals, and system status
 */
export const getAdminOverview = async (): Promise<AdminOverviewResponse> => {
  // Fetch all data in parallel for performance
  const [rawStats, rawRecentAuctions, rawPendingApprovals] = await Promise.all([
    adminRepository.getOverviewStats(),
    adminRepository.getRecentAuctions(),
    adminRepository.getPendingApprovalsCount(),
  ]);

  // Transform using mappers
  const stats = mapAdminOverviewStats(rawStats);
  const recentAuctions = rawRecentAuctions.map(mapAdminOverviewRecentAuction);
  const pendingApprovals =
    mapAdminOverviewPendingApprovals(rawPendingApprovals);
  const systemStatus = mapAdminOverviewSystemStatus();

  return {
    stats,
    recentAuctions,
    pendingApprovals,
    systemStatus,
  };
};
