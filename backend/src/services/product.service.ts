import * as productRepository from "../repositories/product.repository";
import {
  ProductsSearchQuery,
  CreateProduct,
  AppendProductDescription,
  AppendProductQuestion,
  AppendProductAnswer
} from "../api/dtos/requests/product.schema";
import { toNum } from "../utils/number.util";
import {
  PaginatedResult,
  ProductListCardProps,
  ProductDetailResponse,
  BidHistoryResponse,
  QuestionsResponse,
  CreateProductResponse,
} from "../api/dtos/responses/product.type";
import {
  mapToProductListCard,
  maskBidderName,
  calculateSellerRating,
} from "../mappers/product.mapper";
import { toSlug } from "../utils/slug.util";
import * as storageService from "../services/storage.service";

export const searchProducts = async (
  query: ProductsSearchQuery
): Promise<PaginatedResult<ProductListCardProps>> => {
  const { q, categorySlug, page, limit, sort, excludeCategorySlug } = query;

  const result = await productRepository.searchProducts(
    q,
    categorySlug,
    page,
    limit,
    sort,
    excludeCategorySlug
  );

  return {
    data: result.data.map(mapToProductListCard),
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
};

export const createProduct = async (
  data: CreateProduct,
  files: Express.Multer.File[] = []
): Promise<CreateProductResponse> => {
  const categoryPath = await productRepository.getCategoryWithParents(
    data.categoryId
  );

  let categorySlug = "others";
  let subCategorySlug = "misc";

  if (categoryPath && categoryPath.length > 0) {
    if (categoryPath.length >= 2) {
      categorySlug = categoryPath[0].slug;
      subCategorySlug = categoryPath[1].slug;
    } else {
      categorySlug = categoryPath[0].slug;
    }
  }

  const productSlugPart = toSlug(data.name);
  const timestamp = Date.now();
  const productFolder = `${productSlugPart}_${timestamp}`;
  const storagePath = `products/${categorySlug}/${subCategorySlug}/${productFolder}`;

  const uploadedUrls = await Promise.all(
    files.map((file, index) => {
      const fileName = index === 0 ? "main.png" : `ex_${index}.png`;
      const fullPath = `${storagePath}/${fileName}`;
      return storageService.uploadFile(
        "auctionary-product-images",
        file,
        fullPath
      );
    })
  );

  const finalProductSlug = `${productSlugPart}-${timestamp}`;

  const product = await productRepository.createProduct({
    name: data.name,
    category_id: data.categoryId,
    seller_id: data.sellerId,
    start_price: data.startPrice,
    step_price: data.stepPrice,
    buy_now_price: data.buyNowPrice,
    end_time: data.endTime,
    auto_extend: data.autoExtend,
    description: data.description,
    thumbnail_url: uploadedUrls[0] || "",
    image_urls: uploadedUrls,
    slug: finalProductSlug,
  } as any);

  return {
    productId: product.id,
    name: product.name,
    status: product.status,
  };
};

export const appendProductDescription = async (
  productId: number,
  body: AppendProductDescription
): Promise<void> => {
  const { sellerId, content } = body;
  await productRepository.appendProductDescription(
    productId,
    sellerId,
    content
  );
};

export const appendProductQuestion = async (
  productId: number,
  body: AppendProductQuestion
): Promise<void> => {
  const { questionerId, content } = body;
  await productRepository.appendProductQuestion(productId, questionerId, content);
}

export const appendProductAnswer = async (
  productId: number,
  body: AppendProductAnswer
): Promise<void> => {
  const { questionId, answererId, content } = body;
  await productRepository.appendProductAnswer(productId, questionId, answererId, content);
}

// Product Detail Page
export const getProductDetail = async (
  productId: number,
  userId?: number
): Promise<ProductDetailResponse> => {
  // Fetch main product data
  const product = await productRepository.getProductDetailById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Fetch related data in parallel
  const [images, description, categoryPath, watchlistCount] = await Promise.all(
    [
      productRepository.getProductImages(productId),
      productRepository.getProductDescription(productId),
      productRepository.getCategoryWithParents(product.category_id),
      productRepository.getWatchlistCount(productId),
    ]
  );

  // User-specific data
  let userProductStatus = undefined;
  if (userId) {
    const [isWatchlisted, bidStatus] = await Promise.all([
      productRepository.isUserWatchlisted(userId, productId),
      productRepository.getUserBidStatus(userId, productId),
    ]);

    const isTopBidder = product.highest_bidder_id === userId;
    const isOutbid = bidStatus.hasPlacedBid && !isTopBidder;

    userProductStatus = {
      isWatchlisted,
      isOutbid,
      isTopBidder,
      currentUserMaxBid: bidStatus.currentUserMaxBid,
    };
  }

  // Calculate seller rating
  const sellerRating = calculateSellerRating(
    product.positive_reviews || 0,
    product.negative_reviews || 0
  );

  // Build breadcrumb from category path
  const breadcrumb = categoryPath.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  // Get related products (exclude current product)
  const relatedProducts = await productRepository.searchProducts(
    undefined, // no search query
    [product.category_slug], // same category (must be array)
    1, // page
    5, // limit
    undefined, // no sort (use default)
    undefined, // no exclude category
    [productId] // exclude current product
  );

  // Build response
  const response: ProductDetailResponse = {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug || product.category_slug, // Use product slug (fallback to category slug for old products)
      thumbnailUrl: product.thumbnail_url || "",
      images: images.map((img: any) => img.image_url),
      descriptions: (Array.isArray(description) ? description : []).map((d: any) => ({
        content: d.content,
        createdAt: d.created_at,
      })),
      category: {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug,
        parent:
          breadcrumb.length > 1 ? breadcrumb[breadcrumb.length - 2] : null,
      },
      breadcrumb,
      relatedProducts: relatedProducts.data.map(mapToProductListCard),
    },
    seller: {
      id: product.seller_id,
      name: product.seller_name,
      rating: sellerRating,
    },
    auction: {
      startPrice: toNum(product.start_price),
      currentPrice: toNum(product.current_price),
      buyNowPrice: product.buy_now_price
        ? toNum(product.buy_now_price)
        : undefined,
      stepPrice: toNum(product.step_price),
      bidCount: product.bid_count || 0,
      watchlistCount,
      topBidder: maskBidderName(product.bidder_name),
      startTime: product.created_at,
      endTime: product.end_time,
      autoExtend: product.auto_extend,
      status: product.status,
    },
    userProductStatus,
  };

  return response;
};

// Lazy load: Bid History
export const getProductBidHistory = async (
  productId: number,
  page: number = 1,
  limit: number = 20
): Promise<BidHistoryResponse> => {
  const { bids, total } = await productRepository.getProductBidHistory(
    productId,
    page,
    limit
  );

  return {
    bids: bids.map((bid: any) => ({
      bidId: bid.id,
      amount: toNum(bid.amount),
      bidder: maskBidderName(bid.bidder_name),
      bidTime: bid.created_at,
      isTopBid: bid.isTopBid || false,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Lazy load: Q&A
export const getProductQuestions = async (
  productId: number,
  page: number = 1,
  limit: number = 10
): Promise<QuestionsResponse> => {
  const { questions, total } = await productRepository.getProductQuestions(
    productId,
    page,
    limit
  );

  return {
    questions: questions.map((q: any) => ({
      questionId: q.id,
      question: q.question,
      askedBy: q.asker_name,
      askedAt: q.created_at,
      answer: q.answer
        ? {
          answer: q.answer.answer,
          answeredBy: q.answer.answerer_name,
          answeredAt: q.answer.answered_at,
        }
        : null,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


