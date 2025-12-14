import apiClient from "./apiClient";
import type {
  AdminUserListResponse,
  UpgradeRequestListResponse,
  UpgradeRequestActionResponse,
  SuspendUserResponse,
  AdminProductListResponse,
  AdminOverviewResponse,
} from "../types/admin";

/**
 * Get all users for admin management
 */
export const getAllUsers = async (): Promise<AdminUserListResponse> => {
  return apiClient.get("/admin/users", true);
};

/**
 * Get all upgrade requests
 */
export const getAllUpgradeRequests =
  async (): Promise<UpgradeRequestListResponse> => {
    return apiClient.get("/admin/upgrade-requests", true);
  };

/**
 * Approve an upgrade request
 */
export const approveUpgradeRequest = async (
  requestId: number
): Promise<UpgradeRequestActionResponse> => {
  return apiClient.patch(
    `/admin/upgrade-requests/${requestId}/approve`,
    {},
    true
  );
};

/**
 * Reject an upgrade request
 */
export const rejectUpgradeRequest = async (
  requestId: number
): Promise<UpgradeRequestActionResponse> => {
  return apiClient.patch(
    `/admin/upgrade-requests/${requestId}/reject`,
    {},
    true
  );
};

/**
 * Suspend a user account
 */
export const suspendUser = async (
  userId: number
): Promise<SuspendUserResponse> => {
  return apiClient.patch(`/admin/users/${userId}/suspend`, {}, true);
};

/**
 * Get all products for admin management
 * TODO: Backend endpoint /admin/products not implemented yet
 */
export const getAdminProducts = async (): Promise<AdminProductListResponse> => {
  return apiClient.get("/admin/products", true);
};

/**
 * Remove a product (admin action)
 * TODO: Backend endpoint DELETE /admin/products/:id not implemented yet
 * TODO: Add reason parameter for email notification to seller in future
 */
export const removeProduct = async (productId: number): Promise<void> => {
  return apiClient.delete(`/admin/products/${productId}`, true);
};

/**
 * Get admin overview dashboard data
 * Fetches stats, recent auctions, pending approvals, and system status
 */
export const getAdminOverview = async (): Promise<AdminOverviewResponse> => {
  return apiClient.get("/admin/overview", true);
};
