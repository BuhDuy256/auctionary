import apiClient from "./apiClient";
import type { CategoryNode } from "../types/category";

export const getCategories = async (): Promise<CategoryNode[]> => {
  const categoriesData: {
    id: number;
    slug: string;
    name: string;
    children?: { id: number; slug: string; name: string }[];
  }[] = await apiClient.get("/categories");

  return categoriesData.map((cat) => ({
    id: String(cat.id), // Convert numeric ID to string for Select component compatibility
    name: cat.name,
    children:
      cat.children?.map((child) => ({
        id: String(child.id),
        name: child.name,
      })) || [],
  }));
};
