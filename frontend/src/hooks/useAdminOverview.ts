import { useState, useEffect } from "react";
import * as adminService from "../services/adminService";
import type { AdminOverviewResponse } from "../types/admin";
import { toast } from "sonner";

/**
 * Custom hook for Admin Overview dashboard
 * Fetches and manages admin overview data including stats, recent auctions, and pending approvals
 */
export const useAdminOverview = () => {
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getAdminOverview();
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch admin overview";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch admin overview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOverview,
  };
};
