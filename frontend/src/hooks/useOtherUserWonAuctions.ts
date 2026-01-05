import { useState, useEffect } from "react";
import * as userService from "../services/userService";
import type { WonAuction } from "../types/user";

export const useOtherUserWonAuctions = (userId: number) => {
  const [auctions, setAuctions] = useState<WonAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getPublicUserWonAuctions(userId);
        setAuctions(data);
      } catch (err: any) {
        console.error("Failed to fetch won auctions:", err);
        setError("Failed to load won auctions");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAuctions();
    }
  }, [userId]);

  return { auctions, isLoading, error };
};
