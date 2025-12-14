// Admin user management types
export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: "seller" | "bidder";
  status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
  reputation: number | null; // null if no reviews
  positiveReviews: number;
  negativeReviews: number;
  createdAt: string;
}

export interface AdminUserListResponse {
  users: AdminUser[];
}

// Upgrade request types
export interface UpgradeRequestUser {
  id: number;
  fullName: string;
  email: string;
  reputation: number | null;
  positiveReviews: number;
  negativeReviews: number;
  createdAt: string;
}

export interface UpgradeRequest {
  id: number;
  userId: number;
  user: UpgradeRequestUser;
  message: string;
  status: "pending" | "approved" | "rejected" | "expired" | "cancelled";
  createdAt: string;
  approvedAt: string | null;
  expiresAt: string;
}

export interface UpgradeRequestListResponse {
  requests: UpgradeRequest[];
}

export interface UpgradeRequestActionResponse {
  id: number;
  userId: number;
  status: "approved" | "rejected";
  approvedAt?: string;
}

export interface SuspendUserResponse {
  id: number;
  status: "suspended";
}

// Admin product management types
export interface AdminProductSeller {
  id: number;
  name: string;
}

export interface AdminProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface AdminProductHighestBidder {
  id: number | null;
  name: string | null;
}

export interface AdminProduct {
  id: number;
  title: string;
  seller: AdminProductSeller;
  category: AdminProductCategory;
  currentBid: number;
  bids: number;
  status: "active" | "sold" | "expired" | "pending" | "removed";
  endTime: string; // ISO 8601
  thumbnailUrl: string;
  createdAt: string;
  highestBidder: AdminProductHighestBidder;
}

export interface AdminProductListResponse {
  products: AdminProduct[];
}
