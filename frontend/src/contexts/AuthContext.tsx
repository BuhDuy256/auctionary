import React, { createContext, useState, useEffect, useMemo } from "react";
import * as authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import type {
  LoginResponse,
  SignupResponse,
  AuthResponse,
  GenericResponse,
} from "../types/auth";

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  address?: string;
  recaptchaToken: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
    recaptchaToken: string
  ) => Promise<LoginResponse>;

  signup: (formData: SignupData) => Promise<SignupResponse>;
  logout: () => Promise<void>;

  verifyAccount: (otp: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;

  forgotPassword: (email: string) => Promise<GenericResponse>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<GenericResponse>;

  loginWithGoogle: (credential: string) => Promise<AuthResponse>;
  loginWithFacebook: (accessToken: string) => Promise<AuthResponse>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Listen for auth-error events (triggered by 401 responses in apiClient)
  useEffect(() => {
    const handleAuthError = () => {
      console.log("🔴 Auth error event received - clearing user state");
      setUser(null);
      // Token already removed by apiClient
    };

    window.addEventListener("auth-error", handleAuthError);
    return () => window.removeEventListener("auth-error", handleAuthError);
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await authService.getMe();
          setUser(user);
        } catch (error: any) {
          console.error("Token verification failed:", error);
          // Token already removed by apiClient if it was a 401
          // Just clear user state
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (
    email: string,
    password: string,
    recaptchaToken: string
  ): Promise<LoginResponse> => {
    try {
      const loginResponse: LoginResponse = await authService.login(
        email,
        password,
        recaptchaToken
      );

      localStorage.setItem("token", loginResponse.accessToken);

      try {
        const user = await authService.getMe();
        setUser(user);
      } catch (error: any) {
        console.error("Failed to fetch user data after login:", error);
        setUser(null);
      }

      return loginResponse;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (formData: SignupData): Promise<SignupResponse> => {
    try {
      const signupResponse = await authService.signup(formData);

      localStorage.setItem("token", signupResponse.accessToken);

      try {
        const user = await authService.getMe();
        setUser(user);
      } catch (error: any) {
        console.error("Signup success but GetMe failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        throw new Error(
          "Account created but auto-login failed. Please login manually."
        );
      }

      return signupResponse;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const verifyAccount = async (otp: string): Promise<void> => {
    try {
      // Gọi service (lúc này service đã bỏ userId)
      const response = await authService.verifyOTP(otp);

      // Backend trả về AccessToken mới và User đã active -> Lưu ngay lập tức
      localStorage.setItem("token", response.accessToken);
      setUser(response.user); // Cập nhật State -> UI tự đổi sang đã đăng nhập
    } catch (error) {
      console.error("Verification failed:", error);
      throw error;
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    try {
      await authService.resendOTP();
    } catch (error) {
      console.error("Resend OTP failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (code: string): Promise<AuthResponse> => {
    try {
      const response = await authService.loginWithGoogle(code);
      localStorage.setItem("token", response.accessToken);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error("Google login error in context:", error);
      throw error;
    }
  };

  const loginWithFacebook = async (
    accessToken: string
  ): Promise<AuthResponse> => {
    try {
      const response = await authService.loginWithFacebook(accessToken);
      localStorage.setItem("token", response.accessToken);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error("Facebook login error in context:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  const forgotPassword = async (email: string): Promise<GenericResponse> => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<GenericResponse> => {
    return authService.resetPasswordWithOTP(email, otp, newPassword);
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      verifyAccount,
      resendVerificationEmail,
      forgotPassword,
      resetPassword,
      loginWithGoogle,
      loginWithFacebook,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}
