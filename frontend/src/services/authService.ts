import apiClient from "./apiClient";
import type {
  LoginResponse,
  SignupResponse,
  AuthResponse,
  GenericResponse,
} from "../types/auth";
import type { User } from "../types/user";

// --- NEW ---
// Define the shape of signup data based on your schema
// This matches the interface in AuthContext
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  address?: string;
  recaptchaToken: string;
}

/**
 * Handles the login API call.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} recaptchaToken - The token from reCAPTCHA.
 * @returns {Promise<LoginResponse>} The user data and token.
 * @throws {Error} If login fails.
 */
export const login = async (
  email: string,
  password: string,
  recaptchaToken: string
): Promise<LoginResponse> => {
  // POST /auth/login, sends the new body, no auth required
  // This will return { access_token: "..." }
  return apiClient.post(
    "/auth/login",
    { email, password, recaptchaToken },
    false
  );
};

/**
 * Handles the signup API call.
 * @param {SignupData} signupData - An object matching the SignupData interface.
 * @returns {Promise<SignupResponse>} The success message or data.
 * @throws {Error} If signup fails.
 */
export const signup = async (
  signupData: SignupData
): Promise<SignupResponse> => {
  // apiService.post(endpoint, body, requiresAuth)
  // The body now matches the new schema
  return apiClient.post("/auth/signup", signupData, false);
};

/**
 * Verifies the OTP code sent to user's email
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<LoginResponse>} Returns new tokens and updated user
 */
export const verifyOTP = async (
  // BỎ userId ở tham số đầu vào
  otp: string
): Promise<LoginResponse> => {
  // Backend giờ trả về LoginResponse (có user + token mới)
  // Chỉ gửi otp, userId backend tự lấy từ token
  return apiClient.post("/auth/verify-otp", { otp }, true);
};

/**
 * Resends OTP code to user's email
 * @returns {Promise<GenericResponse>} Success message
 */
export const resendOTP = async (): Promise<GenericResponse> => {
  // Không cần truyền userId, backend tự lấy từ token
  return apiClient.post("/auth/resend-otp", {}, true);
};

export const loginWithGoogle = async (code: string): Promise<AuthResponse> => {
  return apiClient.post("/auth/google-login", { code }, false);
};

export const loginWithFacebook = async (
  accessToken: string
): Promise<AuthResponse> => {
  return apiClient.post("/auth/facebook-login", { accessToken }, false);
};

/**
 * Verifies the token from localStorage and returns user data.
 * @returns {Promise<User>} The user data (unwrapped by apiClient).
 * @throws {Error} If token is invalid or request fails.
 */
export const getMe = async (): Promise<User> => {
  // GET /auth/me, no body, *auth is required*
  return apiClient.get("/auth/me", true);
};

/**
 * Logs the user out on the server and clears local token.
 */
export const logout = async (): Promise<void> => {
  try {
    // POST /auth/logout, no body, *auth is required*
    // This invalidates the token on the server
    await apiClient.post("/auth/logout", {}, true);
  } catch (error) {
    // Log the error but proceed to clear local data
    console.error("Server logout failed, clearing local token anyway:", error);
  } finally {
    // Always remove the token from local storage
    localStorage.removeItem("token");
  }
};

export const forgotPassword = async (
  email: string
): Promise<GenericResponse> => {
  return apiClient.post("/auth/forgot-password", { email }, false);
};

export const resetPasswordWithOTP = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<GenericResponse> => {
  return apiClient.post(
    "/auth/reset-password",
    { email, otp, newPassword },
    false
  );
};
