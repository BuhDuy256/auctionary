import apiClient from "./apiClient";
import type { SellerDashboardData } from "../types/seller";

/**
 * Get seller dashboard data including stats and product listings
 */
export const getSellerDashboard = async (): Promise<SellerDashboardData> => {
  return apiClient.get<SellerDashboardData>("/seller/dashboard", true);
};
