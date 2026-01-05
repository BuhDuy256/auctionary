import type { UserRole } from "../constants/roles";

export interface User {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  isVerified: boolean;
  status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
  positiveReviews: number;
  negativeReviews: number;
  roles: UserRole[];
  permissions: string[];
  createdAt: string;
  hasPassword?: boolean;
}

export interface UserStats {
  rating: number;
  likes: number;
  dislikes: number;
  auctionsWon: number;
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface MyBid {
  product_id: number;
  name: string;
  description: string;
  starting_price: number;
  current_price: number;
  buy_now_price?: number;
  thumbnail_url?: string;
  end_time: string; // Dates often string in JSON
  slug: string;
  status: string;
  bid_count: number;
  my_max_bid: number;
  current_highest_bid: number;
  highest_bidder_id: number;
}

export interface WonAuction {
  // Transaction fields
  id: number;
  product_id: number;
  buyer_id: number;
  seller_id: number;
  final_price: number;
  status: string; // transaction status (payment_pending, shipping_pending, delivered, completed, cancelled)
  created_at: string;

  // Joined fields from products table
  product_name: string;
  thumbnail_url: string;
}

// Rating types
export interface RatingItem {
  // Transaction metadata
  transactionId: number;
  transactionDate: string; // ISO date
  completedAt: string | null; // ISO date

  // Rating data
  rating: 1 | -1; // 1 = positive, -1 = negative
  comment: string | null;

  // Reviewer info (the person who gave the rating)
  reviewer: {
    id: number;
    fullName: string;
  };

  // Product context
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnailUrl: string | null;
  };

  // Transaction context
  finalPrice: number;

  // Role context: was the profile user a "buyer" or "seller" in this transaction
  userRole: "buyer" | "seller";
}

export interface RatingSummary {
  totalPositive: number;
  totalNegative: number;
  positivePercentage: number;
}

export interface RatingsResponse {
  ratings: RatingItem[];
  total: number;
  summary: RatingSummary;
}

// Public user profile (for viewing other users)
export interface PublicUserProfile {
  user: {
    id: number;
    fullName: string;
    // email: EXCLUDED for privacy
    // address: EXCLUDED for privacy
    roles: string[]; // e.g., ["bidder"], ["seller"]
    status: "pending_verification" | "active" | "pending_upgrade" | "suspended";
    createdAt: string; // ISO date
    positiveReviews: number;
    negativeReviews: number;
  };

  stats: {
    rating: number; // Percentage (0-100)
    likes: number;
    dislikes: number;
    auctionsWon: number;
  };
}
