import type { User } from "./user";

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
    user: User;
    requiresVerification?: boolean;
  };
  message?: string;
}

export interface SignupResponse {
  data: {
    user: User;
    message?: string;
  };
  message?: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    user: User;
  };
  message?: string;
}

export interface VerifyOTPResponse {
  data: {
    accessToken: string;
    user: User;
  };
  message?: string;
}

export interface GenericResponse {
  message: string;
}
