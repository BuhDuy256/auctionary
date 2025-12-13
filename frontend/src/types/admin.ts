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
