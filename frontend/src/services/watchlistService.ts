import apiClient from "./apiClient";
import type { WatchlistResponse } from "../types/watchlist";

export const getWatchlist = async (): Promise<WatchlistResponse> => {
  return apiClient.get<WatchlistResponse>(`/watchlist`, true);
};

export const addProductToWatchlist = async (data: { productId: number }) => {
  return apiClient.post(`/watchlist/`, data, true);
};

export const removeProductFromWatchlist = async (
  productId: number
): Promise<number> => {
  return apiClient.delete(`/watchlist/${productId}`, true);
};
