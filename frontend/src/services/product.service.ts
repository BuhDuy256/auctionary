import apiClient from "./apiClient";
import type {
  ProductDetailResponse,
  BidHistoryResponse,
  QuestionsResponse,
  ProductListCardProps,
  PaginatedResult,
  PlaceBidResponse,
} from "../types/product";

// Let's assume types are available or I will define them in a types file if needed.
// But wait, the user said "Ensure types match backend...".
// I should probably copy the types to frontend first or assume they are there.
// I'll check `src/types` first in next step if needed, but for now I'll write the service assuming standard imports.

export const getProductDetail = async (id: string): Promise<ProductDetailResponse> => {
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

// Existing search function (preserving it)
export const searchProducts = async (params: any): Promise<PaginatedResult<ProductListCardProps>> => {
  const queryString = new URLSearchParams(params).toString();
  return apiClient.get(`/products?${queryString}`);
};

export const placeBid = async (
  id: string,
  amount: number
): Promise<PlaceBidResponse> => {
  return apiClient.post(`/products/${id}/bid`, { amount }, true);
};
