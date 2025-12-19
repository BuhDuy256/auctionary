import * as userRepo from "../repositories/user.repository";
import * as otpRepo from "../repositories/otp.repository";
import * as tokenRepo from "../repositories/token.repository";
import * as socialRepo from "../repositories/social-account.repository";
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
import * as googleService from "./google.service";
import * as facebookService from "./facebook.service";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import {
  VerificationRequiredResponse,
  UserWithRoles,
  RefreshTokenResponse,
  AuthResult,
} from "../api/dtos/responses/auth.type";
import { OTP_EXPIRY_MINUTES } from "../configs/constants.config";
import {
  SignupSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  GoogleLoginSchema,
  FacebookLoginSchema,
} from "../api/dtos/requests/auth.schema";
import { mapUserToResponse } from "../mappers/auth.mapper";
import { REFRESH_TOKEN_EXPIRY_DAYS } from "../configs/constants.config";

// Helper function to create standardized user payload for JWT
const createUserPayload = async (
  userId: number,
  email: string,
  isVerified: boolean
) => {
  const roles = await userRepo.getUserRoles(userId);
  const permissions = await userRepo.getUserPermissions(userId);
  return {
    id: userId,
    email,
    isVerified,
    roles,
    permissions,
  };
};

export const signupUser = async (
  userData: SignupSchema
): Promise<AuthResult> => {
  const { fullName, email, password, address } = userData;

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    full_name: fullName,
    email,
    password: hashedPassword,
    address: address || null,
    is_verified: false,
    status: "pending_verification",
  };

  const user = await userRepo.createUser(newUser);
  if (!user) throw new BadRequestError("Failed to create user");

  const mappedUser = mapUserToResponse(user)!;

  // Generate OTP for email verification
  const otp = generateOTP(6);
  await otpRepo.createOTP(
    mappedUser.id,
    otp,
    new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    "signup"
  );
  await sendOTPEmail(mappedUser.email, otp, mappedUser.fullName);

  // Generate tokens for auto-login
  const userPayload = await createUserPayload(
    mappedUser.id,
    mappedUser.email,
    mappedUser.isVerified
  );
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  // Store refresh token in database
  await tokenRepo.createRefreshToken(
    mappedUser.id,
    refreshToken,
    new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
  );

  return {
    user: {
      id: mappedUser.id,
      email: mappedUser.email,
      fullName: mappedUser.fullName,
      isVerified: mappedUser.isVerified,
      roles: userPayload.roles,
      permissions: userPayload.permissions,
    },
    accessToken,
    refreshToken,
    message:
      "Account created successfully! Please check your email for verification code.",
  };
};

export const loginUser = async (
  loginData: LoginSchema,
  deviceInfo?: string,
  ipAddress?: string
): Promise<AuthResult | VerificationRequiredResponse> => {
  const { email, password } = loginData;

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const mappedUser = mapUserToResponse(user)!;

  const isPasswordValid = await comparePassword(
    password,
    mappedUser.password as string
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const roles = await userRepo.getUserRoles(mappedUser.id);
  const permissions = await userRepo.getUserPermissions(mappedUser.id);
  const userPayload = await createUserPayload(
    mappedUser.id,
    mappedUser.email,
    mappedUser.isVerified
  );

  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  if (!mappedUser.isVerified) {
    await otpRepo.deleteUserOTPs(mappedUser.id);
    const otp = generateOTP(6);
    await otpRepo.createOTP(
      mappedUser.id,
      otp,
      new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      "signup"
    );
    await sendOTPEmail(mappedUser.email, otp, mappedUser.fullName);

    return {
      requiresVerification: true,
      user: {
        id: mappedUser.id,
        email: mappedUser.email,
        fullName: mappedUser.fullName,
        isVerified: false,
      },
      accessToken: accessToken,
    };
  }

  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry();

  console.log(accessToken);
  await tokenRepo.createRefreshToken(
    mappedUser.id,
    tokenHash,
    expiresAt,
    deviceInfo,
    ipAddress
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: mappedUser.id,
      email: mappedUser.email,
      fullName: mappedUser.fullName,
      isVerified: true,
      roles: roles,
      permissions: permissions,
      hasPassword: mappedUser.hasPassword,
    },
  };
};

export const requestPasswordReset = async (
  data: ForgotPasswordSchema
): Promise<{ message: string }> => {
  const { email } = data;
  const user = await userRepo.findByEmail(email);

  if (!user || !user.is_verified) {
    return {
      message: "If an account with that email exists, an OTP has been sent.",
    };
  }

  const mappedUser = mapUserToResponse(user)!;

  const otp = generateOTP(6);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpRepo.createOTP(mappedUser.id, otp, expiresAt, "reset_password");
  await sendOTPEmail(mappedUser.email, otp, mappedUser.fullName);

  return { message: "An OTP has been sent to your email." };
};

export const resetPasswordWithOTP = async (
  data: ResetPasswordSchema
): Promise<{ message: string }> => {
  const { email, otp, newPassword } = data;
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const validToken = await otpRepo.findValidOTP(user.id, otp, "reset_password");
  if (!validToken) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  const hashedPassword = await hashPassword(newPassword);
  await userRepo.updatePassword(user.id, hashedPassword);

  await otpRepo.markOTPAsUsed(validToken.otp_id);

  return { message: "Password has been reset successfully" };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const decoded = verifyRefreshToken(refreshToken);

  const tokenHash = hashToken(refreshToken);
  const storedToken = await tokenRepo.findRefreshToken(tokenHash);

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  await tokenRepo.updateLastUsed(storedToken.token_id);

  // Fetch fresh roles and permissions from database
  const userPayload = await createUserPayload(
    decoded.id as number,
    decoded.email as string,
    decoded.isVerified as boolean
  );

  const newAccessToken = generateAccessToken(userPayload);

  return {
    accessToken: newAccessToken,
    user: {
      id: storedToken.users.id,
      email: storedToken.users.email,
      fullName: storedToken.users.full_name,
      isVerified: storedToken.users.is_verified,
    },
  };
};

export const logoutUser = async (
  refreshToken: string
): Promise<{ message: string }> => {
  const tokenHash = hashToken(refreshToken);
  await tokenRepo.deleteRefreshToken(tokenHash);
  return { message: "Logged out successfully" };
};

export const logoutAllDevices = async (
  userId: number
): Promise<{ message: string }> => {
  await tokenRepo.deleteUserTokens(userId);
  return { message: "Logged out from all devices" };
};

export const verifyOTP = async (
  userId: number,
  otp: string
): Promise<AuthResult> => {
  const otpRecord = await otpRepo.findValidOTP(userId, otp, "signup");

  if (!otpRecord) {
    throw new BadRequestError("Invalid OTP code");
  }

  if (!otpRecord.created_at || isOTPExpired(new Date(otpRecord.created_at))) {
    throw new BadRequestError("OTP has expired. Please request a new one");
  }

  await otpRepo.markOTPAsUsed(otpRecord.id);

  const verifiedUser = await userRepo.verifyUser(userId);

  if (!verifiedUser) {
    throw new NotFoundError("User not found");
  }

  const mappedUser = mapUserToResponse(verifiedUser)!;

  await sendWelcomeEmail(mappedUser.email, mappedUser.fullName);

  const userPayload = await createUserPayload(
    mappedUser.id,
    mappedUser.email,
    mappedUser.isVerified
  );

  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshTokenExpiry();

  await tokenRepo.createRefreshToken(mappedUser.id, tokenHash, expiresAt);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: mappedUser.id,
      email: mappedUser.email,
      fullName: mappedUser.fullName,
      isVerified: true,
      roles: userPayload.roles,
      permissions: userPayload.permissions,
      hasPassword: mappedUser.hasPassword,
    },
  };
};

export const resendOTP = async (
  userId: number
): Promise<{ message: string }> => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.is_verified) {
    throw new BadRequestError("Email is already verified");
  }

  const mappedUser = mapUserToResponse(user)!;

  await otpRepo.deleteUserOTPs(userId);

  const otp = generateOTP(6);
  await otpRepo.createOTP(
    userId,
    otp,
    new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    "signup"
  );
  await sendOTPEmail(mappedUser.email, otp, mappedUser.fullName);

  return { message: "New OTP sent to your email" };
};

export const getAuthenticatedUser = async (
  userId: number
): Promise<UserWithRoles> => {
  const user = await userRepo.findByIdWithRoles(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const mappedUser = mapUserToResponse(user)!;
  // @ts-ignore
  const roles = user.usersRoles.map((ur: any) => ur.roles.name);
  // @ts-ignore
  const permissions = user.usersPermissions.map(
    (up: any) => up.permissions.name
  );

  return {
    id: mappedUser.id,
    email: mappedUser.email,
    fullName: mappedUser.fullName,
    address: mappedUser.address,
    isVerified: mappedUser.isVerified,
    status: mappedUser.status,
    positiveReviews: mappedUser.positiveReviews,
    negativeReviews: mappedUser.negativeReviews,
    roles: roles,
    permissions: permissions,
    createdAt: mappedUser.createdAt,
    hasPassword: mappedUser.hasPassword,
  };
};

export const loginWithGoogle = async (
  data: GoogleLoginSchema,
  deviceInfo?: string,
  ipAddress?: string
): Promise<AuthResult> => {
  const { code } = data;
  const googlePayload = await googleService.verifyGoogleToken(code);

  if (!googlePayload || !googlePayload.email) {
    throw new BadRequestError("Google account invalid or missing email");
  }

  const { email, name, picture, sub: googleId } = googlePayload;

  const user = await socialRepo.findOrCreateUserFromSocial(
    "google",
    googleId,
    email,
    name || null,
    picture || null
  );

  if (!user) {
    throw new BadRequestError("Failed to create user from Google account");
  }

  const mappedUser = mapUserToResponse(user)!;

  const userPayload = await createUserPayload(
    mappedUser.id,
    mappedUser.email,
    mappedUser.isVerified
  );
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  await tokenRepo.createRefreshToken(
    mappedUser.id,
    hashToken(refreshToken),
    getRefreshTokenExpiry(),
    deviceInfo,
    ipAddress
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: mappedUser.id,
      email: mappedUser.email,
      fullName: mappedUser.fullName,
      isVerified: true,
      roles: userPayload.roles,
      permissions: userPayload.permissions,
      hasPassword: mappedUser.hasPassword,
    },
  };
};

export const loginWithFacebook = async (
  data: FacebookLoginSchema,
  deviceInfo?: string,
  ipAddress?: string
): Promise<AuthResult> => {
  const { accessToken } = data;
  const fbPayload = await facebookService.verifyFacebookToken(accessToken);

  if (!fbPayload.email) {
    throw new BadRequestError("Facebook account must have an email to sign up");
  }

  const { email, name, picture, sub: facebookId } = fbPayload;

  const user = await socialRepo.findOrCreateUserFromSocial(
    "facebook",
    facebookId,
    email,
    name || null,
    picture || null
  );

  if (!user) {
    throw new BadRequestError("Failed to create user from Facebook account");
  }

  const mappedUser = mapUserToResponse(user)!;

  const userPayload = await createUserPayload(
    mappedUser.id,
    mappedUser.email,
    mappedUser.isVerified
  );
  const jwtAccessToken = generateAccessToken(userPayload);
  const jwtRefreshToken = generateRefreshToken(userPayload);

  await tokenRepo.createRefreshToken(
    mappedUser.id,
    hashToken(jwtRefreshToken),
    getRefreshTokenExpiry(),
    deviceInfo,
    ipAddress
  );

  return {
    accessToken: jwtAccessToken,
    refreshToken: jwtRefreshToken,
    user: {
      id: mappedUser.id,
      email: mappedUser.email,
      fullName: mappedUser.fullName,
      isVerified: true,
      roles: userPayload.roles,
      permissions: userPayload.permissions,
      hasPassword: mappedUser.hasPassword,
    },
  };
};
