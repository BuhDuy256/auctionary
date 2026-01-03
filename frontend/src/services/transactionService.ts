import apiClient from "./apiClient";
import type {
  TransactionDetailResponse,
  TransactionMessage,
} from "../types/transaction";
import type {
  PaymentSubmitData,
  ShippingSubmitData,
  DeliveryConfirmData,
  ReviewSubmitData,
} from "../types/transactionActions";

export const getTransactionById = async (
  transactionId: number
): Promise<TransactionDetailResponse> => {
  const data = await apiClient.get<TransactionDetailResponse>(
    `/transactions/${transactionId}`,
    true
  );
  return data;
};

export const submitPayment = async (
  transactionId: number,
  data: PaymentSubmitData
): Promise<TransactionDetailResponse> => {
  const formData = new FormData();
  formData.append("paymentProof", data.paymentProof);
  formData.append("shippingFullName", data.shippingInfo.fullName);
  formData.append("shippingAddress", data.shippingInfo.address);
  formData.append("shippingCity", data.shippingInfo.city);
  formData.append("shippingPhoneNumber", data.shippingInfo.phone);

  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/payment`,
    formData,
    true
  );
  return response;
};

export const confirmAndShip = async (
  transactionId: number,
  data: ShippingSubmitData
): Promise<TransactionDetailResponse> => {
  const formData = new FormData();
  formData.append("shippingProof", data.shippingProof);
  formData.append("paymentConfirmed", data.paymentConfirmed.toString());

  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/shipping`,
    formData,
    true
  );
  return response;
};

export const confirmDelivery = async (
  transactionId: number,
  data: DeliveryConfirmData
): Promise<TransactionDetailResponse> => {
  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/delivery`,
    data,
    true
  );
  return response;
};

export const submitReview = async (
  transactionId: number,
  data: ReviewSubmitData
): Promise<TransactionDetailResponse> => {
  const response = await apiClient.post<TransactionDetailResponse>(
    `/transactions/${transactionId}/review`,
    data,
    true
  );
  return response;
};

/**
 * Send a message in transaction chat
 * @param transactionId - Transaction ID
 * @param content - Message content (max 300 characters, validated by backend)
 * @returns Promise<TransactionMessage> - Created message with senderRole
 */
export const sendTransactionMessage = async (
  transactionId: number,
  content: string
): Promise<TransactionMessage> => {
  const response = await apiClient.post<TransactionMessage>(
    `/transactions/${transactionId}/messages`,
    { content },
    true
  );
  return response;
};
