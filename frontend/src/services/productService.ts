import apiClient from "./apiClient";
import type {
  Product,
  SearchProductsParams,
  PaginatedResponse,
} from "../types/product";

export const searchProducts = async (
  params: SearchProductsParams
): Promise<PaginatedResponse<Product>> => {
  const queryParams = new URLSearchParams();

  if (params.q) {
    queryParams.append("q", params.q);
  }

  if (params.categorySlug) {
    if (Array.isArray(params.categorySlug)) {
      params.categorySlug.forEach((slug) =>
        queryParams.append("categorySlug", slug)
      );
    } else {
      queryParams.append("categorySlug", params.categorySlug);
    }
  }

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  }

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

  return apiClient.get<PaginatedResponse<Product>>(endpoint);
};
