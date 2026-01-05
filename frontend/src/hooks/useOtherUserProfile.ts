import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import type { PublicUserProfile } from "../types/user";

export const useOtherUserProfile = (userId: number) => {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getPublicUserProfile(userId);
        setProfile(data);
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        if (err.response?.status === 403) {
          setError("PROFILE_UNAVAILABLE");
        } else if (err.response?.status === 404) {
          setError("USER_NOT_FOUND");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { profile, isLoading, error };
};
