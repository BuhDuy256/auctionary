export interface Product {
  id: string;
  slug?: string;
  title: string;
  image: string;
  currentBid: number;
  buyNowPrice?: number;
  topBidder: string;
  timeLeft: string;
  endTime: string;
  status: string;
  isNewArrival?: boolean;
  bidCount: number;
  transaction?: {
    id: number;
    canAccess: boolean;
  };
}

export interface SearchProductsParams {
  q?: string;
  categorySlug?: string | string[];
  page?: number;
  limit?: number;
  sort?: string;
  excludeCategorySlug?: string | string[];
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
// Product Detail Page - Type Definitions

export interface ProductDetailResponse {
  product: ProductInfo;
  seller: SellerInfo;
  auction: AuctionInfo;
  userProductStatus?: UserProductStatus;
}

export interface ProductInfo {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
  images: string[];
  descriptions: {
    content: string;
    createdAt: string;
  }[];
  category: CategoryWithParent;
  breadcrumb: BreadcrumbItem[];
  relatedProducts: ProductListCardProps[];
}

export interface CategoryWithParent {
  id: number;
  name: string;
  slug: string;
  parent: BreadcrumbItem | null;
}

export interface BreadcrumbItem {
  id: number;
  name: string;
  slug: string;
}

export interface SellerInfo {
  id: number;
  name: string;
  rating: SellerRating;
}

export interface SellerRating {
  average: number;
  totalReviews: number;
  positivePercentage: number;
}

export interface AuctionInfo {
  startPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  stepPrice: number;
  bidCount: number;
  watchlistCount: number;
  topBidder: string;
  startTime: string;
  endTime: string;
  autoExtend: boolean;
  status: string;
}

export interface UserProductStatus {
  isWatchlisted: boolean;
  isOutbid: boolean;
  isTopBidder: boolean;
  currentUserMaxBid?: number;
}

// Bid History (Lazy Load)
export interface BidHistoryResponse {
  bids: BidHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BidHistoryItem {
  bidId: number;
  amount: number;
  bidder: string;
  bidTime: string;
  isTopBid: boolean;
}

// Q&A (Lazy Load)
export interface QuestionsResponse {
  questions: QuestionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QuestionItem {
  questionId: number;
  question: string;
  askedBy: string;
  askedAt: string;
  answer: AnswerItem | null;
}

export interface AnswerItem {
  answer: string;
  answeredBy: string;
  answeredAt: string;
}

export interface ProductListCardProps {
  id: string;
  slug?: string;
  title: string;
  image: string;
  currentBid: number;
  buyNowPrice?: number;
  topBidder: string;
  timeLeft: string;
  endTime: string;
  status: string;
  isNewArrival?: boolean;
  bidCount: number;
  transaction?: {
    id: number;
    canAccess: boolean;
  };
}

export interface PlaceBidResponse {
  status: "winning" | "outbid";
  currentPrice: number;
  currentWinnerId: number;
  bidCount: number;
}

export interface CreateProductResponse {
  productId: number;
  name: string;
  status: string;
}

export interface Step1Data {
  productName: string;
  category: string;
  categoryId: string;
  subCategory: string;
  subCategoryId: string;
  images: File[];
}

export interface Step2Data {
  startingPrice: number;
  bidIncrement: number;
  buyNowPrice?: number;
  duration: number;
  description: string;
  autoExtend: boolean;
}
export interface AuctionFormData extends Step1Data, Step2Data { }

export interface CreateProductPayload {
  name: string;
  categoryId: number;
  sellerId: number;
  startPrice: number;
  stepPrice: number;
  buyNowPrice?: number;
  description: string;
  endTime: Date;
  autoExtend: boolean;
  images: File[];
}
