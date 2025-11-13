import prisma from "../database/prisma";

export const createRefreshToken = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date,
  deviceInfo?: string,
  ipAddress?: string
) => {
  return prisma.refresh_tokens.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      device_info: deviceInfo,
      ip_address: ipAddress,
    },
  });
};

export const findRefreshToken = async (tokenHash: string) => {
  return prisma.refresh_tokens.findFirst({
    where: {
      token_hash: tokenHash,
      expires_at: {
        gt: new Date(), // Token must not be expired
      },
    },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          full_name: true,
          is_verified: true,
        },
      },
    },
  });
};

export const updateLastUsed = async (tokenId: number) => {
  return prisma.refresh_tokens.update({
    where: { token_id: tokenId },
    data: { last_used_at: new Date() },
  });
};

export const deleteRefreshToken = async (tokenHash: string) => {
  return prisma.refresh_tokens.deleteMany({
    where: { token_hash: tokenHash },
  });
};

export const deleteUserTokens = async (userId: number) => {
  return prisma.refresh_tokens.deleteMany({
    where: { user_id: userId },
  });
};

export const deleteExpiredTokens = async () => {
  return prisma.refresh_tokens.deleteMany({
    where: {
      expires_at: {
        lt: new Date(),
      },
    },
  });
};

export const getUserTokens = async (userId: number) => {
  return prisma.refresh_tokens.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
};
