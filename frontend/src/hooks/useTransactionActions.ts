import { useState } from "react";
import {
  submitPayment,
  confirmAndShip,
  confirmDelivery,
  submitReview,
  sendTransactionMessage,
} from "../services/transactionService";
import type {
  PaymentSubmitData,
  ShippingSubmitData,
  DeliveryConfirmData,
  ReviewSubmitData,
} from "../types/transactionActions";

export const useTransactionActions = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitPayment = async (
    transactionId: number,
    data: PaymentSubmitData
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await submitPayment(transactionId, data);
      return response;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit payment";
      setError(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmAndShip = async (
    transactionId: number,
    data: ShippingSubmitData
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await confirmAndShip(transactionId, data);
      return response;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to confirm and ship";
      setError(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelivery = async (
    transactionId: number,
    data: DeliveryConfirmData
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await confirmDelivery(transactionId, data);
      return response;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to confirm delivery";
      setError(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmitReview = async (
    transactionId: number,
    data: ReviewSubmitData
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await submitReview(transactionId, data);
      return response;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit review";
      setError(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Send a message in transaction chat
   * @param transactionId - Transaction ID
   * @param message - Message content (max 300 characters)
   */
  const handleSendMessage = async (transactionId: number, message: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await sendTransactionMessage(transactionId, message);
      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      setError(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSubmitPayment,
    handleConfirmAndShip,
    handleConfirmDelivery,
    handleSubmitReview,
    handleSendMessage,
    isUpdating,
    error,
  };
};
