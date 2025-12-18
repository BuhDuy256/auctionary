import type { UpgradeRequestStatus } from "../api/dtos/responses/upgradeRequest.type";

/**
 * Map raw DB upgrade request data to camelCase response format
 */
export const mapUpgradeRequestToResponse = (
  request: any
): UpgradeRequestStatus => {
  return {
    requestId: request.id,
    userId: request.user_id,
    status: request.status,
    message: request.message,
    createdAt: request.created_at,
    approvedAt: request.approved_at,
    expiresAt: request.expires_at,
  };
};
