import { useState, useCallback } from "react";
import * as upgradeRequestService from "../services/upgradeRequestService";
import type { UpgradeRequest } from "../types/upgradeRequest";
import { notify } from "../utils/notify";

export const useUpgradeRequest = () => {
  const [requestStatus, setRequestStatus] = useState<UpgradeRequest | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch current upgrade request status
   */
  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await upgradeRequestService.getUpgradeRequestStatus();
      setRequestStatus(response.request);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch request status";
      setError(errorMessage);
      console.error("Failed to fetch upgrade request status:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Submit a new upgrade request
   */
  const submitRequest = useCallback(
    async (message: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await upgradeRequestService.submitUpgradeRequest(
          message
        );
        notify.success(response.message);
        // Refresh status after submission
        await fetchStatus();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit request";
        setError(errorMessage);
        notify.error(errorMessage);
        console.error("Failed to submit upgrade request:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchStatus]
  );

  /**
   * Cancel pending upgrade request
   */
  const cancelRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await upgradeRequestService.cancelUpgradeRequest();
      notify.success(response.message);
      // Refresh status after cancellation
      await fetchStatus();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel request";
      setError(errorMessage);
      notify.error(errorMessage);
      console.error("Failed to cancel upgrade request:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus]);

  return {
    requestStatus,
    isLoading,
    error,
    fetchStatus,
    submitRequest,
    cancelRequest,
  };
};
