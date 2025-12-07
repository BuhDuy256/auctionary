import * as userRepository from "../repositories/user.repository";
import { UserStatsResponse } from "../api/dtos/responses/user.type";
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

export const getWatchlist = async (userId: number) => {
  return userRepository.getWatchlist(userId);
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
