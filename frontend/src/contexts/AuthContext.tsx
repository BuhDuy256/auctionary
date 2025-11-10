import React, { createContext, useState, useEffect, useMemo } from "react";
import * as authService from "../services/authService"; // Import your service
import { useNavigate } from "react-router-dom"; // Import useNavigate
import type { User } from "../types/user";

// Define the shape of the auth context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<any>;
  signup: (formData: { [key: string]: any }) => Promise<any>;
  logout: () => Promise<void>;
}

// 1. Create the Context with a proper generic (nullable)
export const AuthContext = createContext<AuthContextType | null>(null);

// 2. Create the Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track initial token verification
  const navigate = useNavigate(); // Get navigate for logout

  // 3. Check for a token on app load
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // This function checks the token and returns the user
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          // Token is invalid or expired
          console.error("Token verification failed:", error);
          authService.logout(); // Use the service to clear the bad token
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  // 4. Login Action
  const login = async (username: string, password: string): Promise<any> => {
    // Service throws error on failure, component will catch it
    const data = await authService.login(username, password);
    localStorage.setItem("token", data.access_token);

    try {
      const userData = await authService.getMe();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user data after login:", error);
      authService.logout(); // Clear the bad token
      setUser(null);
      throw new Error("Login succeeded but failed to verify user.");
    }
  };

  // 5. Signup Action
  const signup = async (formData: { [key: string]: any }): Promise<any> => {
    // Service handles the API call, component handles navigation
    return authService.signup(formData);
  };

  // 6. Logout Action
  const logout = async (): Promise<void> => {
    try {
      await authService.logout(); // Call the service to logout from server and clear token
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state even if server call fails
    } finally {
      setUser(null);
      navigate("/login"); // Redirect to login after logout
    }
  };

  // 7. Memoize the context value
  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading]
  );

  // 8. Return the Provider
  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we know auth status */}
      {!isLoading ? children : null /* Or a global spinner */}
    </AuthContext.Provider>
  );
}
