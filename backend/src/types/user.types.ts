export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  address: string | null;
  isVerified: boolean;
  roles: string[];
  stats: UserStats;
  createdAt: Date;
}

export interface UserStats {
  positiveRatings: number;
  negativeRatings: number;
  auctionsWon: number;
}

export interface WatchlistItem {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  endTime: Date;
  bidCount: number;
  isActive: boolean;
}

export interface ActiveBidItem {
  id: string;
  title: string;
  currentBid: number;
  yourMaxBid: number;
  status: "leading" | "outbid";
  endTime: Date;
  bidCount: number;
}

export interface WonAuctionItem {
  id: string;
  title: string;
  finalPrice: number;
  wonDate: Date;
  status: string;
}

export interface MyListingItem {
  id: string;
  title: string;
  currentBid: number;
  startingPrice: number;
  views: number; // Note: Views might not be in DB yet, can default to 0
  bidCount: number;
  endTime: Date;
  status: string;
}
