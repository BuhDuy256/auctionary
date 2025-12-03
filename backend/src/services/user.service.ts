import bcrypt from "bcryptjs";
import * as userRepository from "../repositories/user.repository";
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
} from "../api/schemas/user.schema";
import { UserProfile, UserStats } from "../types/user.types";
import { NotFoundError, BadRequestError, ForbiddenError } from "../errors";

export const getProfile = async (userId: number): Promise<UserProfile> => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const roles = await userRepository.getUserRoles(userId);
  const wonCount = await userRepository.countWonAuctions(userId);

  const stats: UserStats = {
    positiveRatings: user.positive_reviews,
    negativeRatings: user.negative_reviews,
    auctionsWon: wonCount,
  };

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    address: user.address,
    isVerified: user.is_verified,
    roles: roles.map((r: any) => r.name),
    stats,
    createdAt: user.created_at,
  };
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileSchema
) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password
  );
  if (!isPasswordValid) {
    throw new ForbiddenError("Invalid password");
  }

  // Check email uniqueness if changed
  if (data.email !== user.email) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }
  }

  const updatedUser = await userRepository.update(userId, data);
  return updatedUser;
};

export const changePassword = async (
  userId: number,
  data: ChangePasswordSchema
) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password
  );
  if (!isPasswordValid) {
    throw new ForbiddenError("Invalid password");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.newPassword, salt);

  await userRepository.updatePassword(userId, hashedPassword);
};

export const getWatchlist = async (
  userId: number,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;
  const items = await userRepository.getWatchlist(userId, limit, offset);

  return items.map((item: any) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.image_url,
    currentBid: Number(item.current_bid),
    endTime: item.end_time,
    bidCount: item.bid_count,
    isActive: item.status === "active", // simplified status check
  }));
};

export const getActiveBids = async (
  userId: number,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;
  const items = await userRepository.getActiveBids(userId, limit, offset);

  return items.map((item: any) => ({
    id: item.id,
    title: item.title,
    currentBid: Number(item.current_bid),
    yourMaxBid: Number(item.your_max_bid),
    status: item.highest_bidder_id === userId ? "leading" : "outbid",
    endTime: item.end_time,
    bidCount: item.bid_count,
  }));
};

export const getWonAuctions = async (
  userId: number,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;
  const items = await userRepository.getWonAuctions(userId, limit, offset);

  return items.map((item: any) => ({
    id: item.id,
    title: item.title,
    finalPrice: Number(item.final_price),
    wonDate: item.won_date,
    status: item.status,
  }));
};

export const getMyListings = async (
  userId: number,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;
  const items = await userRepository.getMyListings(userId, limit, offset);

  return items.map((item: any) => ({
    id: item.id,
    title: item.title,
    currentBid: Number(item.current_bid),
    startingPrice: Number(item.starting_price),
    bidCount: item.bid_count,
    endTime: item.end_time,
    status: item.status,
    views: 0, // Placeholder as per requirement
  }));
};
