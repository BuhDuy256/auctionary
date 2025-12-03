import apiClient from "./apiClient";
import type {
  UserProfile,
  UpdateProfileSchema,
  ChangePasswordSchema,
  WatchlistItem,
  ActiveBidItem,
  WonAuctionItem,
  MyListingItem,
} from "../types/user";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get("/users/profile", true);
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileSchema
): Promise<UserProfile> => {
  const response = await apiClient.patch("/users/profile", data, true);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordSchema
): Promise<void> => {
  await apiClient.patch("/users/change-password", data, true);
};

export const getWatchlist = async (
  page: number = 1,
  limit: number = 10
): Promise<WatchlistItem[]> => {
  const response = await apiClient.get(
    `/users/watchlist?page=${page}&limit=${limit}`,
    true
  );
  return response.data;
};

export const getActiveBids = async (
  page: number = 1,
  limit: number = 10
): Promise<ActiveBidItem[]> => {
  const response = await apiClient.get(
    `/users/active-bids?page=${page}&limit=${limit}`,
    true
  );
  return response.data;
};

export const getWonAuctions = async (
  page: number = 1,
  limit: number = 10
): Promise<WonAuctionItem[]> => {
  const response = await apiClient.get(
    `/users/won-auctions?page=${page}&limit=${limit}`,
    true
  );
  return response.data;
};

export const getMyListings = async (
  page: number = 1,
  limit: number = 10
): Promise<MyListingItem[]> => {
  const response = await apiClient.get(
    `/users/my-listings?page=${page}&limit=${limit}`,
    true
  );
  return response.data;
};
