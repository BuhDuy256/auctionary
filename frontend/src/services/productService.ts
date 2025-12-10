import apiClient from "./apiClient";
import type {
  Product,
  SearchProductsParams,
  PaginatedResult,
  ProductDetailResponse,
  BidHistoryResponse,
  QuestionsResponse,
  PlaceBidResponse,
  CreateProductPayload,
} from "../types/product";

export const searchProducts = async (
  params: SearchProductsParams
): Promise<PaginatedResult<Product>> => {
  const queryParams = new URLSearchParams();

  if (params.q) {
    queryParams.append("q", params.q);
  }

  if (params.categorySlug) {
    if (Array.isArray(params.categorySlug)) {
      params.categorySlug.forEach((slug) =>
        queryParams.append("categorySlug", slug)
      );
    } else {
      queryParams.append("categorySlug", params.categorySlug);
    }
  }

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

  return apiClient.get<PaginatedResult<Product>>(endpoint);
};

export const getProductDetail = async (
  id: string
): Promise<ProductDetailResponse> => {
  return apiClient.get(`/products/${id}`);
};

export const getProductBids = async (
  id: string,
  page: number = 1
): Promise<BidHistoryResponse> => {
  return apiClient.get(`/products/${id}/bids?page=${page}`);
};

export const getProductQuestions = async (
  id: string,
  page: number = 1
): Promise<QuestionsResponse> => {
  return apiClient.get(`/products/${id}/questions?page=${page}`);
};

export const placeBid = async (
  id: string,
  amount: number
): Promise<PlaceBidResponse> => {
  return apiClient.post(`/products/${id}/bid`, { amount }, true);
};
export const appendDescription = async (
  id: string,
  content: string,
  sellerId: number
): Promise<void> => {
  return apiClient.post(`/products/${id}/descriptions`, { content, sellerId }, true);
};
export const appendQuestion = async (
  id: string,
  content: string,
  questionerId: number | undefined
): Promise<void> => {
  return apiClient.post(`/products/${id}/questions`, { content, questionerId }, true)
}
export const appendAnswer = async (
  id: string,
  questionId: number | undefined,
  content: string,
  answererId: number | undefined
): Promise<void> => {
  return apiClient.post(`/products/${id}/answers`, { content, questionId, answererId }, true)
}
export const createProduct = async (data: CreateProductPayload) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("categoryId", data.categoryId.toString());
  formData.append("sellerId", data.sellerId.toString());
  formData.append("description", data.description);

  formData.append("startPrice", data.startPrice.toString());
  formData.append("stepPrice", data.stepPrice.toString());
  if (data.buyNowPrice) {
    formData.append("buyNowPrice", data.buyNowPrice.toString());
  }

  formData.append("endTime", data.endTime.toISOString());
  formData.append("autoExtend", String(data.autoExtend));

  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }
  return apiClient.post("/products", formData, true);
};
