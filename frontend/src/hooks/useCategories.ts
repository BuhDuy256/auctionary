import { useState, useEffect, useMemo } from "react";
import * as categoryService from "../services/categoryService";
import type { CategoryNode } from "../types/category";

interface SelectedCategory {
  id: string;
  name: string;
}

export const useCategories = (selectedSlugs: string[] = []) => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch categories")
        );
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategoriesWithNames = useMemo((): SelectedCategory[] => {
    const findCategory = (
      cats: CategoryNode[],
      slug: string
    ): CategoryNode | null => {
      for (const cat of cats) {
        if (cat.id === slug) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, slug);
          if (found) return found;
        }
      }
      return null;
    };

    return selectedSlugs
      .map((slug) => {
        const cat = findCategory(categories, slug);
        return cat ? { id: cat.id, name: cat.name } : null;
      })
      .filter((item): item is SelectedCategory => item !== null);
  }, [categories, selectedSlugs]);

  return { categories, loading, error, selectedCategoriesWithNames };
};
