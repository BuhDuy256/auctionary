import * as userRepo from "../repositories/user.repository";
import * as otpRepo from "../repositories/otp.repository";
import * as tokenRepo from "../repositories/token.repository";
import { hashPassword, comparePassword } from "../utils/hash.util";
import { generateOTP, isOTPExpired } from "../utils/otp.util";
import { sendOTPEmail, sendWelcomeEmail } from "./email.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
} from "../utils/jwt.util";

export const signupUser = async (userData: any) => {
  const existingUser = await userRepo.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(userData.password);
  const newUser = {
    ...userData,
    password: hashedPassword,
  };

  const user = await userRepo.createUser(newUser);

  // Generate and send OTP
  const otp = generateOTP(6);
  await otpRepo.createOTP(user.id, otp);
  await sendOTPEmail(user.email, otp, user.full_name);

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    is_verified: user.is_verified,
    message: "OTP sent to your email. Please verify to continue.",
  };
};

export const loginUser = async (
  loginData: any,
  deviceInfo?: string,
  ipAddress?: string
) => {
  const { email, password } = loginData;

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email before logging in");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const userPayload = {
    id: user.id,
    email: user.email,
  };

  // Generate tokens
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  // Hash and save refresh token to database
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry();

  await tokenRepo.createRefreshToken(
    user.id,
    tokenHash,
    expiresAt,
    deviceInfo,
    ipAddress
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in database and is valid
    const tokenHash = hashToken(refreshToken);
    const storedToken = await tokenRepo.findRefreshToken(tokenHash);

    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }

    // Update last used time
    await tokenRepo.updateLastUsed(storedToken.token_id);

    // Generate new access token
    const userPayload = {
      id: decoded.id,
      email: decoded.email,
    };

    const newAccessToken = generateAccessToken(userPayload);

    return {
      accessToken: newAccessToken,
      user: storedToken.users,
    };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logoutUser = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken);
  await tokenRepo.deleteRefreshToken(tokenHash);
  return { message: "Logged out successfully" };
};

export const logoutAllDevices = async (userId: number) => {
  await tokenRepo.deleteUserTokens(userId);
  return { message: "Logged out from all devices" };
};

export const verifyOTP = async (userId: number, otp: string) => {
  const otpRecord = await otpRepo.findValidOTP(userId, otp);

  if (!otpRecord) {
    throw new Error("Invalid OTP code");
  }

  if (!otpRecord.created_at || isOTPExpired(new Date(otpRecord.created_at))) {
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Mark OTP as used
  await otpRepo.markOTPAsUsed(otpRecord.id);

  // Verify user
  const verifiedUser = await userRepo.verifyUser(userId);

  // Send welcome email
  await sendWelcomeEmail(verifiedUser.email, verifiedUser.full_name);

  return verifiedUser;
};

export const resendOTP = async (userId: number) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.is_verified) {
    throw new Error("Email is already verified");
  }

  // Delete old OTPs
  await otpRepo.deleteUserOTPs(userId);

  // Generate and send new OTP
  const otp = generateOTP(6);
  await otpRepo.createOTP(userId, otp);
  await sendOTPEmail(user.email, otp, user.full_name);

  return { message: "New OTP sent to your email" };
};
