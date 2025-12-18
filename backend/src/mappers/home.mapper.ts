import type { HomeAuctionItem } from "../api/dtos/responses/home.type";

/**
 * Raw database row structure for home auction items
 */
interface RawHomeAuctionRow {
  id: string;
  name: string;
  thumbnail_url: string | null;
  current_price: string; // Knex returns numeric as string
  buy_now_price: string | null;
  seller_name: string;
  top_bidder_name: string | null;
  bid_count: number;
  end_time: Date;
}

/**
 * Maps raw database row to HomeAuctionItem response format
 * Converts snake_case to camelCase and transforms data types
 */
export const mapToHomeAuctionItem = (
  row: RawHomeAuctionRow
): HomeAuctionItem => {
  return {
    id: row.id,
    title: row.name,
    image: row.thumbnail_url || "",
    currentBid: parseFloat(row.current_price),
    buyNowPrice: row.buy_now_price ? parseFloat(row.buy_now_price) : null,
    seller: row.seller_name,
    topBidder: row.top_bidder_name,
    bidCount: row.bid_count,
    endTime: row.end_time.toISOString(),
  };
};

/**
 * Maps an array of raw database rows to HomeAuctionItem array
 */
export const mapToHomeAuctionItems = (
  rows: RawHomeAuctionRow[]
): HomeAuctionItem[] => {
  return rows.map(mapToHomeAuctionItem);
};
