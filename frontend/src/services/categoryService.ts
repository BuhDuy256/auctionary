import apiClient from "./apiClient";
import type { CategoryNode } from "../types/category";

export const getCategories = async (): Promise<CategoryNode[]> => {
  const categoriesData: { slug: string; name: string; children?: { slug: string; name: string }[] }[] = await apiClient.get("/categories");

  return categoriesData.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    children: cat.children?.map((child) => ({
      id: child.slug,
      name: child.name,
    })) || [],
  }));
};