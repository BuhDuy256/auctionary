import * as sellerRepository from "../repositories/seller.repository";
import { SellerDashboardResponse } from "../api/dtos/responses/seller.type";

/**
 * Get seller dashboard data including stats and listings
 */
export const getSellerDashboard = async (
  sellerId: number
): Promise<SellerDashboardResponse> => {
  const [stats, listings] = await Promise.all([
    sellerRepository.getSellerStats(sellerId),
    sellerRepository.getSellerListings(sellerId),
  ]);

  return {
    stats,
    listings,
  };
};
