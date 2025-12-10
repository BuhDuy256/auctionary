export interface SellerDashboardStats {
  activeAuctions: number;
  totalBids: number;
  totalRevenue: number;
  avgBidTime: number; // days
}

// need adding "pending" in the future
export type ProductStatus = "active" | "removed" | "sold" | "expired";

export interface SellerDashboardListing {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  categoryName: string;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  endTime: string;
  status: ProductStatus;
  createdAt: string;
}

export interface SellerDashboardData {
  stats: SellerDashboardStats;
  listings: SellerDashboardListing[];
}
