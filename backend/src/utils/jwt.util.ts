import jwt from "jsonwebtoken";
import crypto from "crypto";
import { envConfig } from "../configs/env.config";
import { JWT_CONSTANTS } from "../configs/constants.config";

const ACCESS_SECRET = envConfig.JWT_ACCESS_SECRET;
const REFRESH_SECRET = envConfig.JWT_REFRESH_SECRET;

interface TokenPayload {
  id: number;
  email: string;
  isVerified: boolean;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET as string, {
    expiresIn: JWT_CONSTANTS.ACCESS_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET as string, {
    expiresIn: JWT_CONSTANTS.REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET as string) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET as string) as TokenPayload;
};

// Hash token for secure storage
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Get refresh token expiry date
export const getRefreshTokenExpiry = (): Date => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + JWT_CONSTANTS.REFRESH_EXPIRY_DAYS);
  return expiryDate;
};

// Decode token without verification (to check expiry)
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
