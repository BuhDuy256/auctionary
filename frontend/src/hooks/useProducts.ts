import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as productService from "../services/productService";
import type { Product } from "../types/product";

export const useProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const searchQuery = searchParams.get("q") || "";
  const categorySlugs = searchParams.getAll("category");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortParam = searchParams.get("sort") || "endTime:asc";

  // Ensure sort param exists
  useEffect(() => {
    if (!searchParams.has("sort")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("sort", "endTime:asc");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching products with params:", {
          q: searchQuery,
          categorySlug: categorySlugs,
          page: currentPage,
          sort: sortParam,
        });
        const result = await productService.searchProducts({
          q: searchQuery || undefined,
          categorySlug: categorySlugs.length > 0 ? categorySlugs : undefined,
          page: currentPage,
          limit: 9,
          sort: sortParam,
        });

        if (result.data[0].transaction) {
          console.log("Transaction data found in products:", result.data[0].transaction);
        } else {
          console.log("No transaction data in products.");
        }
        console.log("Fetched products:", result);
        setProducts(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categorySlugs.join(","), currentPage, sortParam]);

  const handleCategoryChange = (categoryIds: string[], checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);

    // Remove all existing categorySlug params first
    newParams.delete("category");

    let updatedSlugs: string[];
    if (checked) {
      // Add the new category IDs to existing ones
      updatedSlugs = [...new Set([...categorySlugs, ...categoryIds])];
    } else {
      // Remove the unchecked category IDs
      updatedSlugs = categorySlugs.filter(
        (slug) => !categoryIds.includes(slug)
      );
    }

    // Append all updated slugs
    updatedSlugs.forEach((slug) => newParams.append("category", slug));

    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleRemoveSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleRemoveCategory = (categoryId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    const remaining = categorySlugs.filter((slug) => slug !== categoryId);
    remaining.forEach((slug) => newParams.append("category", slug));
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set("sort", sortParam);
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  // TODO: Add a refetch function for manual refresh (useful after bid placement)
  // const refetch = useCallback(() => {
  //   fetchProducts();
  // }, [searchQuery, categorySlugs, currentPage, sortParam]);

  return {
    products,
    loading,
    error,
    pagination,
    priceRange,
    setPriceRange,
    searchQuery,
    categorySlugs,
    sortParam,
    handleCategoryChange,
    handleRemoveSearch,
    handleRemoveCategory,
    handleClearAllFilters,
    handleSortChange,
    handlePageChange,
    // TODO: Uncomment when implementing refetch
    // refetch,
  };
};
