import { useState, useEffect } from "react";
import * as transactionService from "../services/transactionService";
import type { TransactionDetailResponse } from "../types/transaction";

interface UseTransactionResult {
  transaction: TransactionDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch transaction details
 * @param transactionId - Transaction ID to fetch
 * @returns Transaction data, loading state, error, and refetch function
 */
export const useTransaction = (transactionId: number): UseTransactionResult => {
  const [transaction, setTransaction] = useState<TransactionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionService.getTransactionById(transactionId);
      setTransaction(data);
      console.log("✅ Transaction fetched successfully:", data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to load transaction";
      setError(errorMessage);
      console.error("❌ Failed to fetch transaction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  return {
    transaction,
    isLoading,
    error,
    refetch: fetchTransaction,
  };
};
