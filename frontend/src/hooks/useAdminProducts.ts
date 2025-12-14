import { useState, useEffect, useMemo } from "react";
import * as adminService from "../services/adminService";
import type { AdminProduct } from "../types/admin";
import { toast } from "sonner";

interface ProductStats {
  total: number;
  active: number;
  sold: number;
  expired: number;
  pending: number;
  removed: number;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getAdminProducts();
      setProducts(response.products);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate stats from all products
  const stats: ProductStats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      sold: products.filter((p) => p.status === "sold").length,
      expired: products.filter((p) => p.status === "expired").length,
      pending: products.filter((p) => p.status === "pending").length,
      removed: products.filter((p) => p.status === "removed").length,
    };
  }, [products]);

  // Filter products - client-side
  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return products.filter((product) => {
      // Search by ID or title
      const matchesSearch =
        product.id.toString().includes(searchLower) ||
        product.title.toLowerCase().includes(searchLower);

      // Filter by category
      const matchesCategory =
        categoryFilter === "all" ||
        product.category.id.toString() === categoryFilter;

      // Filter by status
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  // Paginate filtered products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, itemsPerPage]);

  // Handler: Remove product
  const handleRemoveProduct = async (
    productId: number,
    productTitle: string
  ) => {
    try {
      await adminService.removeProduct(productId);
      toast.success(`Product "${productTitle}" has been removed`);
      // Refresh products list
      await fetchProducts();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove product";
      toast.error(errorMessage);
      console.error("Failed to remove product:", err);
    }
  };

  return {
    // Data
    products: paginatedProducts,
    allProducts: products, // For category dropdown
    stats,
    isLoading,
    error,

    // Filters
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,

    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems: filteredProducts.length,

    // Actions
    handleRemoveProduct,
    refetch: fetchProducts,
  };
};
