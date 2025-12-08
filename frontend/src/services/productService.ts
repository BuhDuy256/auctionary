import apiClient from "./apiClient";
import type {
  Product,
  SearchProductsParams,
  PaginatedResult,
  ProductDetailResponse,
  BidHistoryResponse,
  QuestionsResponse,
  PlaceBidResponse,
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
