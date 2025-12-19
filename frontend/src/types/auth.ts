import type { User } from "./user";

// Note: apiClient automatically unwraps { success, data } → returns data directly
export interface LoginResponse {
  accessToken: string;
  user: User;
  requiresVerification?: boolean;
}

export interface SignupResponse {
  id: number;
  email: string;
  fullName: string;
  isVerified: boolean;
  message: string;
  accessToken: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface VerifyOTPResponse {
  accessToken: string;
  user: User;
}

export interface GenericResponse {
  message: string;
}
