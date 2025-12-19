export interface User {
  id: number;
  email: string;
  fullName: string;
  address: string | null;
  isVerified: boolean;
  status: string;
  positiveReviews: number;
  negativeReviews: number;
  createdAt: Date;
  hasPassword?: boolean;
}

export interface UserWithRoles extends User {
  roles: string[];
  permissions: string[];
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  address?: string | null;
  recaptchaToken: string;
}

export interface LoginData {
  email: string;
  password: string;
  recaptchaToken: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  isVerified: boolean;
  roles?: string[];
  permissions?: string[];
  hasPassword?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

export interface SignupResponse {
  id: number;
  email: string;
  fullName: string;
  isVerified: boolean;
  message: string;
  accessToken: string;
}

export interface AuthResult {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface VerificationRequiredResponse {
  requiresVerification: true;
  user: UserResponse;
  accessToken: string;
}

export interface GoogleLoginData {
  code: string;
}

export interface FacebookLoginData {
  accessToken: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    isVerified: boolean;
  };
}
