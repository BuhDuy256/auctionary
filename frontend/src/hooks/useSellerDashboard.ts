import { useState, useEffect } from "react";
import * as sellerService from "../services/sellerService";
import type { SellerDashboardData } from "../types/seller";

export const useSellerDashboard = () => {
  const [data, setData] = useState<SellerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await sellerService.getSellerDashboard();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch seller dashboard:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
