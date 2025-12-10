import { useState } from "react";
import { createProduct } from "../services/productService";
import type { CreateProductPayload } from "../types/product";

export const useProductUpload = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAuction = async (data: CreateProductPayload) => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await createProduct(data);
      return response;
    } catch (err: any) {
      const msg = err.message || "Failed to create auction";
      setError(msg);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { createAuction, isCreating, error };
};
