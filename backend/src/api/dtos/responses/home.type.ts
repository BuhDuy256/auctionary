/**
 * Response types for Home page endpoints
 */

/**
 * Individual auction item displayed on the home page
 */
export interface HomeAuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  buyNowPrice: number | null;
  seller: string;
  topBidder: string | null;
  bidCount: number;
  endTime: string; // ISO 8601 timestamp
}

/**
 * Response for GET /api/home/sections
 * Contains three sections: ending soon, most active, and highest price
 */
export interface HomeSectionsResponse {
  endingSoon: HomeAuctionItem[];
  mostActive: HomeAuctionItem[];
  highestPrice: HomeAuctionItem[];
}
