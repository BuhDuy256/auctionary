import apiClient from "./apiClient";
import type { CategoryResponse, CategoryNode } from "../types/category";

export const getCategories = async (): Promise<CategoryNode[]> => {
  const response = await apiClient.get("/categories");
  const categoriesData: { slug: string; name: string; children?: { slug: string; name: string }[] }[] = response.data || [];

  return categoriesData.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    children: cat.children?.map((child) => ({
      id: child.slug,
      name: child.name,
    })) || [],
  }));
};
