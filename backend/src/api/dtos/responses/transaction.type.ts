export type SenderRole = "buyer" | "seller" | "system";

export interface TransactionMessage {
  id: number;
  senderId: number;
  senderRole: SenderRole; // Derived from comparing senderId with buyer/seller IDs (senderId = 1 = system/admin)
  content: string;
  createdAt: string; // ISO Date String
}

export type TransactionStatus =
  | "payment_pending" // Chờ người mua upload bằng chứng thanh toán + địa chỉ giao hàng
  | "shipping_pending" // Chờ người bán xác nhận thanh toán và upload bằng chứng vận chuyển
  | "delivered" // Đã giao hàng, chờ người mua xác nhận đã nhận được hàng
  | "completed" // Giao dịch hoàn tất
  | "cancelled";

export interface UserSnippet {
  id: number;
  fullName: string;
}

export interface ProductSnippet {
  id: number;
  name: string;
  thumbnailUrl: string;
}

export interface TransactionDetailResponse {
  id: number;
  status: TransactionStatus;
  finalPrice: number;

  product: ProductSnippet;
  buyer: UserSnippet;
  seller: UserSnippet;

  shippingInfo: {
    fullName: string | null;
    phoneNumber: string | null;
    city: string | null;
    address: string | null;
  };

  payment: {
    proofUrl: string | null;
    uploadedAt: string | null;
    confirmedAt: string | null;
  };

  fulfillment: {
    proofUrl: string | null;
    uploadedAt: string | null;
    shippedConfirmedAt: string | null;
    deliveredAt: string | null;
    buyerReceivedAt: string | null;
  };

  ratings: {
    buyer: {
      rate: 1 | -1 | null;
      comment: string | null;
    };
    seller: {
      rate: 1 | -1 | null;
      comment: string | null;
    };
  };

  // Chat/Messages liên quan đến transaction này
  messages: TransactionMessage[];

  // Metadata hệ thống
  cancelReason: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response type for POST /transactions/:id/messages
 * Returns a single message after it's created
 */
export type TransactionMessageResponse = TransactionMessage;
