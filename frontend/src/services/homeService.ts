import apiClient from "./apiClient";
import type { HomeSections } from "../types/home";

/**
 * Get all home page sections (ending soon, most active, highest price)
 * Public endpoint - no authentication required
 * Note: apiClient automatically unwraps { success: true, data: {...} } and returns just the data
 */
export const getHomeSections = async (): Promise<HomeSections> => {
  return apiClient.get("/home/sections");
};
