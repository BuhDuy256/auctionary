import apiClient from "./apiClient";
import type {
  UserStatsResponse,
  User,
  MyBid,
  WonAuction,
  RatingsResponse,
  PublicUserProfile,
} from "../types/user";

export const getStats = async (): Promise<UserStatsResponse> => {
  return apiClient.get("/users/me/stats", true);
};

export const getActiveBids = async (): Promise<MyBid[]> => {
  return apiClient.get("/users/me/bids", true);
};

export const getWonAuctions = async (): Promise<WonAuction[]> => {
  return apiClient.get("/users/me/won-auctions", true);
};

export const getRatings = async (
  role: "buyer" | "seller" | "all" = "all"
): Promise<RatingsResponse> => {
  return apiClient.get(`/users/me/ratings?role=${role}`, true);
};

export const getMyListings = async () => {
  return apiClient.get("/users/me/listings", true);
};

export const updateProfile = async (data: {
  fullName?: string;
  address?: string;
}): Promise<User> => {
  return apiClient.patch("/users/me/profile", data, true);
};

export const updateEmail = async (
  email: string,
  password: string
): Promise<User> => {
  return apiClient.patch("/users/me/email", { email, password }, true);
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<User> => {
  return apiClient.patch(
    "/users/me/password",
    {
      currentPassword,
      newPassword,
    },
    true
  );
};

// Public user profile services (for viewing other users)
export const getPublicUserProfile = async (
  userId: number
): Promise<PublicUserProfile> => {
  return apiClient.get(`/users/${userId}/profile`, true);
};

export const getPublicUserWonAuctions = async (
  userId: number
): Promise<WonAuction[]> => {
  return apiClient.get(`/users/${userId}/won-auctions`, true);
};

export const getPublicUserRatings = async (
  userId: number,
  role: "buyer" | "seller" | "all" = "all"
): Promise<RatingsResponse> => {
  return apiClient.get(`/users/${userId}/ratings?role=${role}`, true);
};
