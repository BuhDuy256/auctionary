import * as userRepository from "../repositories/user.repository";
import {
  RatingsResponse,
  UserStatsResponse,
} from "../api/dtos/responses/user.type";
import { NotFoundError } from "../errors";
import { hashPassword, comparePassword } from "../utils/hash.util";

export const getStats = async (userId: number): Promise<UserStatsResponse> => {
  const reviews = await userRepository.getPositiveNegativeReviewsById(userId);
  if (!reviews) {
    throw new NotFoundError("User not found");
  }

  const auctionsWon = await userRepository.countWonAuctions(userId);

  const positive = reviews.positive_reviews || 0;
  const negative = reviews.negative_reviews || 0;
  const totalReviews = positive + negative;

  let rating = 0;
  if (totalReviews > 0) {
    rating = Math.round((positive / totalReviews) * 100);
  }

  return {
    stats: {
      rating,
      likes: positive,
      dislikes: negative,
      auctionsWon,
    },
  };
};

export const getActiveBids = async (userId: number) => {
  return userRepository.getActiveBids(userId);
};

export const getWonAuctions = async (userId: number) => {
  return userRepository.getWonAuctions(userId);
};

export const updateProfile = async (
  userId: number,
  data: { fullName?: string; address?: string }
) => {
  const updateData: any = {};
  if (data.fullName) updateData.full_name = data.fullName;
  if (data.address) updateData.address = data.address;

  if (Object.keys(updateData).length === 0) return;

  return userRepository.updateUser(userId, updateData);
};

export const updateEmail = async (
  userId: number,
  email: string,
  passwordForauth: string
) => {
  // 1. Verify password
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.password) {
    const isMatch = await comparePassword(passwordForauth, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
  }

  // 2. Check if email taken
  const existing = await userRepository.findByEmail(email);
  if (existing && existing.id !== userId) {
    throw new Error("Email already in use");
  }

  return userRepository.updateUser(userId, { email });
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // If user has a password, verify it
  if (user.password) {
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Invalid current password");
    }
  }

  const hashedNewPassword = await hashPassword(newPassword);

  return userRepository.updateUser(userId, {
    password: hashedNewPassword,
  });
};

export const getRatings = async (
  userId: number,
  role: "buyer" | "seller" | "all" = "all"
): Promise<RatingsResponse> => {
  // Import mapper
  const { mapRatingToResponse } = await import("../mappers/user.mapper");

  // Fetch raw ratings from repository
  const rawRatings = await userRepository.getUserRatings(userId, role);

  // Transform to response format
  const ratings = rawRatings.map(mapRatingToResponse);

  // Calculate summary
  const totalPositive = ratings.filter((r) => r.rating === 1).length;
  const totalNegative = ratings.filter((r) => r.rating === -1).length;
  const totalReviews = totalPositive + totalNegative;
  const positivePercentage =
    totalReviews > 0 ? Math.round((totalPositive / totalReviews) * 100) : 0;

  return {
    ratings,
    total: ratings.length,
    summary: {
      totalPositive,
      totalNegative,
      positivePercentage,
    },
  };
};

/**
 * Get public user profile (for viewing other users)
 * @param userId - User ID to fetch
 * @returns Public user profile with stats
 * @throws NotFoundError if user not found
 */
export const getPublicUserProfile = async (
  userId: number
): Promise<import("../api/dtos/responses/user.type").PublicUserProfile> => {
  const { mapPublicUserProfile } = await import("../mappers/user.mapper");

  const userProfile = await userRepository.getUserProfileById(userId);

  if (!userProfile) {
    throw new NotFoundError("User not found");
  }

  const auctionsWon = await userRepository.countWonAuctions(userId);

  return mapPublicUserProfile(userProfile, auctionsWon);
};

/**
 * Get won auctions for a specific user (public view)
 * @param userId - User ID to fetch won auctions for
 * @returns Array of won auctions
 * @throws NotFoundError if user not found
 */
export const getUserWonAuctionsById = async (userId: number) => {
  // Verify user exists first
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return userRepository.getUserWonAuctionsById(userId);
};
