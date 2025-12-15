import { useState, useEffect } from "react";
import * as homeService from "../services/homeService";
import type { HomeSections, HomeAuctionItem } from "../types/home";

interface UseHomeSectionsReturn {
  sections: HomeSections | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching home page sections
 * Automatically calculates isHot badge (bidCount >= 15)
 */
export const useHomeSections = (): UseHomeSectionsReturn => {
  const [sections, setSections] = useState<HomeSections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateIsHot = (item: HomeAuctionItem): HomeAuctionItem => {
    return {
      ...item,
      isHot: item.bidCount >= 15,
    };
  };

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await homeService.getHomeSections();

      // apiClient already unwraps the response { success: true, data: {...} }
      // and returns just the data, so response is already HomeSections
      const sectionsWithIsHot: HomeSections = {
        endingSoon: response.endingSoon.map(calculateIsHot),
        mostActive: response.mostActive.map(calculateIsHot),
        highestPrice: response.highestPrice.map(calculateIsHot),
      };

      setSections(sectionsWithIsHot);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load home sections"
      );
      console.error("Failed to fetch home sections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    isLoading,
    error,
    refetch: fetchSections,
  };
};
