import type { User } from "./user";

// Note: apiClient automatically unwraps { success, data } → returns data directly
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  requiresVerification?: boolean;
}

export interface SignupResponse {
  id: number;
  email: string;
  fullName: string;
  isVerified: boolean;
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface VerifyOTPResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface GenericResponse {
  message: string;
}
