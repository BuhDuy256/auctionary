import { TransactionDetailRaw } from "../repositories/transaction.repository";
import {
  TransactionDetailResponse,
  TransactionMessage,
} from "../api/dtos/responses/transaction.type";

/**
 * Map raw transaction data from DB (snake_case) to API response format (camelCase)
 * @param raw - Raw transaction data from database with JOINs
 * @param messages - Transaction messages from separate query
 * @returns TransactionDetailResponse in camelCase
 */
export const mapTransactionDetailToResponse = (
  raw: TransactionDetailRaw,
  messages: TransactionMessage[]
): TransactionDetailResponse => {
  return {
    id: raw.id,
    status: raw.status as TransactionDetailResponse["status"],
    finalPrice: Number(raw.final_price),

    product: {
      id: raw.product_id,
      name: raw.product_name,
      thumbnailUrl: raw.product_thumbnail_url,
    },

    buyer: {
      id: raw.buyer_id,
      fullName: raw.buyer_full_name,
    },

    seller: {
      id: raw.seller_id,
      fullName: raw.seller_full_name,
    },

    shippingInfo: {
      fullName: raw.shipping_full_name,
      phoneNumber: raw.shipping_phone_number,
      city: raw.shipping_city,
      address: raw.shipping_address,
    },

    payment: {
      proofUrl: raw.payment_proof_url,
      uploadedAt: raw.payment_proof_uploaded_at,
      confirmedAt: raw.payment_confirmed_at,
    },

    fulfillment: {
      proofUrl: raw.shipping_proof_url,
      uploadedAt: raw.shipping_proof_uploaded_at,
      shippedConfirmedAt: raw.shipped_confirmed_at,
      deliveredAt: raw.delivered_at,
      buyerReceivedAt: raw.buyer_received_at,
    },

    ratings: {
      buyer: {
        rate: raw.buyer_rating as 1 | -1 | null,
        comment: raw.buyer_comment,
      },
      seller: {
        rate: raw.seller_rating as 1 | -1 | null,
        comment: raw.seller_comment,
      },
    },

    messages,

    cancelReason: raw.cancel_reason,
    completedAt: raw.completed_at,
    cancelledAt: raw.cancelled_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
};

/**
 * Map raw transaction message to API response format
 * Derives senderRole by comparing senderId with buyer/seller IDs
 * @param raw - Raw message data from database
 * @param buyerId - Buyer's user ID
 * @param sellerId - Seller's user ID
 * @returns TransactionMessage with senderRole
 */
export const mapTransactionMessageToResponse = (
  raw: {
    id: number;
    sender_id: number;
    content: string;
    created_at: string;
  },
  buyerId: number,
  sellerId: number
): TransactionMessage => {
  // Derive senderRole
  let senderRole: TransactionMessage["senderRole"];

  if (raw.sender_id === 1) {
    // senderId = 1 represents system/admin messages
    senderRole = "system";
  } else if (raw.sender_id === buyerId) {
    senderRole = "buyer";
  } else if (raw.sender_id === sellerId) {
    senderRole = "seller";
  } else {
    // Default fallback (shouldn't happen in normal flow)
    senderRole = "system";
  }

  return {
    id: raw.id,
    senderId: raw.sender_id,
    senderRole,
    content: raw.content,
    createdAt: raw.created_at,
  };
};
