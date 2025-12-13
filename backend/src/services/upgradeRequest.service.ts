import * as upgradeRequestRepository from "../repositories/upgradeRequest.repository";
import { mapUpgradeRequestToResponse } from "../mappers/upgradeRequest.mapper";
import type {
  UpgradeRequestStatusResponse,
  SubmitUpgradeRequestResponse,
  CancelUpgradeRequestResponse,
} from "../api/dtos/responses/upgradeRequest.type";
import { NotFoundError, BadRequestError, ForbiddenError } from "../errors";

/**
 * Submit an upgrade request
 * Validates user eligibility (active, verified, has positive reviews)
 * Creates request and updates user status to pending_upgrade
 */
export const submitUpgradeRequest = async (
  userId: number,
  message: string
): Promise<SubmitUpgradeRequestResponse> => {
  // Get user data for eligibility check
  const user = await upgradeRequestRepository.getUserForEligibilityCheck(
    userId
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if user is verified
  if (!user.is_verified) {
    throw new ForbiddenError(
      "You must verify your account before requesting an upgrade"
    );
  }

  // Check if user status is active
  if (user.status !== "active") {
    throw new BadRequestError(
      `Cannot submit upgrade request. Your account status is: ${user.status}`
    );
  }

  // Check if user has positive reviews
  //   if (user.positive_reviews === 0) {
  //     throw new BadRequestError(
  //       "You need at least one positive review to become a seller"
  //     );
  //   }

  // Check if user already has a pending request
  const existingRequest = await upgradeRequestRepository.getUserActiveRequest(
    userId
  );
  if (existingRequest) {
    throw new BadRequestError(
      "You already have a pending upgrade request. Please wait for admin to process it or cancel your current request."
    );
  }

  // Create upgrade request
  const request = await upgradeRequestRepository.createUpgradeRequest(
    userId,
    message
  );

  // Update user status to pending_upgrade
  await upgradeRequestRepository.updateUserStatus(userId, "pending_upgrade");

  return {
    requestId: request.request_id,
    message:
      "Upgrade request submitted successfully. We will review your request soon.",
  };
};

/**
 * Get user's current upgrade request status
 * Returns null if no request exists
 */
export const getMyUpgradeRequestStatus = async (
  userId: number
): Promise<UpgradeRequestStatusResponse> => {
  const request = await upgradeRequestRepository.getUpgradeRequestByUserId(
    userId
  );

  if (!request) {
    return { request: null };
  }

  const mappedRequest = mapUpgradeRequestToResponse(request);
  return { request: mappedRequest };
};

/**
 * Cancel user's pending upgrade request
 * Validates request exists and is pending
 * Updates request status to cancelled and reverts user status to active
 */
export const cancelMyUpgradeRequest = async (
  userId: number
): Promise<CancelUpgradeRequestResponse> => {
  // Get user's current request
  const request = await upgradeRequestRepository.getUpgradeRequestByUserId(
    userId
  );

  if (!request) {
    throw new NotFoundError("No upgrade request found");
  }

  // Verify the request belongs to the user (extra security check)
  if (request.user_id !== userId) {
    throw new ForbiddenError("You can only cancel your own upgrade request");
  }

  // Check if request is pending
  if (request.status !== "pending") {
    throw new BadRequestError(
      `Cannot cancel request. Request status is: ${request.status}`
    );
  }

  // Cancel the request
  await upgradeRequestRepository.cancelUpgradeRequest(request.request_id);

  // Revert user status to active
  await upgradeRequestRepository.updateUserStatus(userId, "active");

  return {
    message: "Upgrade request cancelled successfully",
  };
};
