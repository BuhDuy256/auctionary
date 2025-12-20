import apiClient from "./apiClient";
import type { TransactionDetailResponse } from "../types/transaction";

/**
 * Get transaction details by ID
 * @param transactionId - Transaction ID
 * @returns Promise<TransactionResponse> - Full transaction data
 */
export const getTransactionById = async (
  transactionId: number
): Promise<TransactionDetailResponse> => {
  // apiClient.get() already unwraps { success: true, data: {...} } → returns data directly
  const data = await apiClient.get<TransactionDetailResponse>(
    `/transactions/${transactionId}`,
    true // requires authentication
  );
  return data;
};
