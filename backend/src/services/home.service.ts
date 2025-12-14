import * as homeRepository from "../repositories/home.repository";
import { mapToHomeAuctionItems } from "../mappers/home.mapper";
import type { HomeSectionsResponse } from "../api/dtos/responses/home.type";

/**
 * Get all home page sections
 * Fetches ending soon, most active, and highest price auctions in parallel
 * Transforms raw database data to camelCase response format
 */
export const getHomeSections = async (): Promise<HomeSectionsResponse> => {
  // Fetch all three sections in parallel for performance
  const [rawEndingSoon, rawMostActive, rawHighestPrice] = await Promise.all([
    homeRepository.getEndingSoonAuctions(),
    homeRepository.getMostActiveAuctions(),
    homeRepository.getHighestPriceAuctions(),
  ]);

  // Transform using mapper
  const endingSoon = mapToHomeAuctionItems(rawEndingSoon);
  const mostActive = mapToHomeAuctionItems(rawMostActive);
  const highestPrice = mapToHomeAuctionItems(rawHighestPrice);

  return {
    endingSoon,
    mostActive,
    highestPrice,
  };
};
