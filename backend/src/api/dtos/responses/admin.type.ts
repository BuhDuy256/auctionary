// User management response types
export interface AdminUserListItem {
  id: number;
  fullName: string;
  email: string;
  role: "seller" | "bidder";
  status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
  reputation: number | null; // null if no reviews
  positiveReviews: number;
  negativeReviews: number;
  createdAt: string; // ISO 8601 format
}

export interface AdminUserListResponse {
  users: AdminUserListItem[];
}

// Upgrade request response types
export interface UpgradeRequestUser {
  id: number;
  fullName: string;
  email: string;
  reputation: number | null;
  positiveReviews: number;
  negativeReviews: number;
  createdAt: string;
}

export interface UpgradeRequestListItem {
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
  requests: UpgradeRequestListItem[];
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

// Product management response types
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

export interface AdminProductListItem {
  id: number;
  title: string;
  seller: AdminProductSeller;
  category: AdminProductCategory;
  currentBid: number;
  bids: number;
  status: "active" | "sold" | "expired" | "pending" | "removed";
  endTime: string; // ISO 8601 format
  thumbnailUrl: string;
  createdAt: string; // ISO 8601 format
  highestBidder: AdminProductHighestBidder;
}

export interface AdminProductListResponse {
  products: AdminProductListItem[];
}
