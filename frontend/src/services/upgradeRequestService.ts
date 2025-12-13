import apiClient from "./apiClient";
import type {
  UpgradeRequestStatusResponse,
  SubmitUpgradeRequestResponse,
  CancelUpgradeRequestResponse,
} from "../types/upgradeRequest";

/**
 * Submit an upgrade request to become a seller
 */
export const submitUpgradeRequest = async (
  message: string
): Promise<SubmitUpgradeRequestResponse> => {
  return apiClient.post("/users/upgrade-request", { message }, true);
};

/**
 * Get current user's upgrade request status
 */
export const getUpgradeRequestStatus =
  async (): Promise<UpgradeRequestStatusResponse> => {
    return apiClient.get("/users/upgrade-request/status", true);
  };

/**
 * Cancel pending upgrade request
 */
export const cancelUpgradeRequest =
  async (): Promise<CancelUpgradeRequestResponse> => {
    return apiClient.patch("/users/upgrade-request/cancel", {}, true);
  };
