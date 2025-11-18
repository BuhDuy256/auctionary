import prisma from "../database/prisma";
import * as userRepo from "./user.repository";

/**
 * Tìm một tài khoản xã hội dựa trên provider và providerId
 */
export const findSocialAccount = async (
  provider: string,
  providerId: string
) => {
  return prisma.social_accounts.findUnique({
    where: {
      provider_provider_id: {
        provider,
        provider_id: providerId,
      },
    },
    include: { users: true },
  });
};

/**
 * Tạo một liên kết tài khoản xã hội mới
 */
export const createSocialAccount = async (data: {
  userId: number;
  provider: string;
  providerId: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}) => {
  return prisma.social_accounts.create({
    data: {
      user_id: data.userId,
      provider: data.provider,
      provider_id: data.providerId,
      email: data.email,
      name: data.name,
      avatar_url: data.avatarUrl,
    },
  });
};

/**
 * Tìm hoặc tạo mới User và Social Account
 * Đây là logic phức tạp mà chúng ta tách ra từ Service
 */
export const findOrCreateUserFromSocial = async (
  provider: string,
  providerId: string,
  email: string,
  name: string | null,
  avatarUrl: string | null
) => {
  // 1. Tìm social account
  let socialAccount = await findSocialAccount(provider, providerId);

  if (socialAccount) {
    return socialAccount.users;
  }

  // 2. Chưa có social account -> Tìm user theo email
  let user = await userRepo.findByEmail(email);

  if (!user) {
    // 3. User chưa tồn tại -> Tạo user mới
    user = await userRepo.createUser({
      data: {
        email,
        full_name: name || "New User",
        is_verified: true, // Email từ social luôn tin cậy
        status: "active",
        // password là null
      },
    });
  }

  // 4. Tạo liên kết Social Account (cho cả user mới và cũ)
  await createSocialAccount({
    userId: user.id,
    provider,
    providerId,
    email,
    name,
    avatarUrl,
  });

  return user;
};
