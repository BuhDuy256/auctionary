export interface UserStats {
  rating: number; // percentage (0-100)
  likes: number; // positive_reviews
  dislikes: number; // negative_reviews
  auctionsWon: number;
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface MyBid {
  // Product fields (partial/key ones)
  product_id: number;
  name: string;
  description: string;
  starting_price: number;
  current_price: number; // This might be from product table, but query also returns calculated max bid
  buy_now_price?: number;
  thumbnail_url?: string;
  end_time: Date;
  slug: string;
  status: string;
  bid_count: number;

  // Bid specific fields from query
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
  created_at: Date;

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
