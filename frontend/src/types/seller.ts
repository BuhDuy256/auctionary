export interface SellerDashboardStats {
  activeAuctions: number;
  totalBids: number;
  totalRevenue: number;
  avgBidTime: number; // days
}

export type ProductStatus = "active" | "pending" | "sold" | "unsold";

export interface SellerDashboardListing {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  categoryName: string;
  startPrice: number;
  currentPrice: number;
  bidCount: number;
  endTime: string; // ISO string from JSON
  status: ProductStatus;
  createdAt: string; // ISO string from JSON
}

export interface SellerDashboardData {
  stats: SellerDashboardStats;
  listings: SellerDashboardListing[];
}
