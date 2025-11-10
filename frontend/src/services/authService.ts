import apiClient from "./apiClient";

/**
 * Handles the login API call.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} The user data and token
 * @throws {Error} If login fails
 */
export const login = async (username: string, password: string) => {
  // POST /auth/login, sends a body, no auth required
  // This will return { access_token: "..." }
  return apiClient.post("/auth/login", { username, password }, false);
};

/**
 * Handles the signup API call.
 * @param {object} signupData - An object containing all required signup fields
 * @returns {Promise<object>} The success message or data
 * @throws {Error} If signup fails
 */
export const signup = async (signupData: { [key: string]: any }) => {
  // apiService.post(endpoint, body, requiresAuth)
  return apiClient.post("/auth/signup", signupData, false);
};

/**
 * Verifies the token from localStorage and returns user data.
 * @returns {Promise<object>} The user data
 * @throws {Error} If token is invalid or request fails
 */
export const getMe = async () => {
  // GET /auth/me, no body, *auth is required*
  return apiClient.get("/auth/me", true);
};

/**
 * Logs the user out on the server.
 */
export const logout = async () => {
  // POST /auth/logout, no body, *auth is required*
  // This invalidates the token on the server
  await apiClient.post("/auth/logout", {}, true);
  // Also remove the token from local storage
  localStorage.removeItem("token");
};
