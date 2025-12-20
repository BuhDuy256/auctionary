import db from "../database/db";

export interface TransactionInfo {
  id: number;
  product_id: number;
  buyer_id: number | null;
  seller_id: number;
}

/**
 * Full transaction data with all related information
 * Includes product, buyer, seller info via JOINs
 */
export interface TransactionDetailRaw {
  // Transaction fields
  id: number;
  status: string;
  final_price: number;

  // Shipping info
  shipping_full_name: string | null;
  shipping_phone_number: string | null;
  shipping_city: string | null;
  shipping_address: string | null;

  // Payment info
  payment_proof_url: string | null;
  payment_proof_uploaded_at: string | null;
  payment_confirmed_at: string | null;

  // Fulfillment info
  shipping_proof_url: string | null;
  shipping_proof_uploaded_at: string | null;
  shipped_confirmed_at: string | null;
  delivered_at: string | null;
  buyer_received_at: string | null;

  // Ratings
  buyer_rating: number | null;
  buyer_comment: string | null;
  seller_rating: number | null;
  seller_comment: string | null;

  // Metadata
  cancel_reason: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;

  // Product info (via JOIN)
  product_id: number;
  product_name: string;
  product_thumbnail_url: string;

  // Buyer info (via JOIN)
  buyer_id: number;
  buyer_full_name: string;

  // Seller info (via JOIN)
  seller_id: number;
  seller_full_name: string;
}

export const findTransactionById = async (
  transactionId: number
): Promise<TransactionInfo | null> => {
  const transaction = await db("transactions")
    .where({ id: transactionId })
    .select("id", "product_id", "buyer_id", "seller_id")
    .first();

  return transaction || null;
}

/**
 * Get full transaction details with all related information
 * Includes JOINs for product, buyer, and seller data
 */
export const findTransactionDetailById = async (
  transactionId: number
): Promise<TransactionDetailRaw | null> => {
  const transaction = await db("transactions")
    .leftJoin("products", "transactions.product_id", "products.id")
    .leftJoin("users as buyer", "transactions.buyer_id", "buyer.id")
    .leftJoin("users as seller", "transactions.seller_id", "seller.id")
    .where("transactions.id", transactionId)
    .select(
      // Transaction fields
      "transactions.id",
      "transactions.status",
      "transactions.final_price",

      // Shipping info
      "transactions.shipping_full_name",
      "transactions.shipping_phone_number",
      "transactions.shipping_city",
      "transactions.shipping_address",

      // Payment info
      "transactions.payment_proof_url",
      "transactions.payment_proof_uploaded_at",
      "transactions.payment_confirmed_at",

      // Fulfillment info
      "transactions.shipping_proof_url",
      "transactions.shipping_proof_uploaded_at",
      "transactions.shipped_confirmed_at",
      "transactions.delivered_at",
      "transactions.buyer_received_at",

      // Ratings
      "transactions.buyer_rating",
      "transactions.buyer_comment",
      "transactions.seller_rating",
      "transactions.seller_comment",

      // Metadata
      "transactions.cancel_reason",
      "transactions.completed_at",
      "transactions.cancelled_at",
      "transactions.created_at",
      "transactions.updated_at",

      // Product info
      "products.id as product_id",
      "products.name as product_name",
      "products.thumbnail_url as product_thumbnail_url",

      // Buyer info
      "buyer.id as buyer_id",
      "buyer.full_name as buyer_full_name",

      // Seller info
      "seller.id as seller_id",
      "seller.full_name as seller_full_name"
    )
    .first();

  return transaction || null;
}

export const findTransactionByProductId = async (
  productId: number
): Promise<TransactionInfo | null> => {
  const transaction = await db("transactions")
    .where({ product_id: productId })
    .select("id", "product_id", "buyer_id", "seller_id")
    .first();

  return transaction || null;
};

export const findTransactionsByProductIds = async (
  productIds: number[]
): Promise<TransactionInfo[]> => {
  if (productIds.length === 0) {
    return [];
  }

  const transactions = await db("transactions")
    .whereIn("product_id", productIds)
    .select("id", "product_id", "buyer_id", "seller_id");

  return transactions;
};

/**
 * Get transaction messages for a specific transaction
 */
export const findTransactionMessages = async (
  transactionId: number
): Promise<Array<{
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
}>> => {
  const messages = await db("transaction_messages")
    .where({ transaction_id: transactionId })
    .select("id", "sender_id", "content", "created_at")
    .orderBy("created_at", "asc");

  return messages;
};

export const updateTransactionPayment = async (
  transactionId: number,
  data: {
    payment_proof_url: string;
    shipping_full_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_phone_number: string;
    payment_proof_uploaded_at: Date;
  }
): Promise<void> => {
  await db("transactions")
    .where({ id: transactionId })
    .update({
      payment_proof_url: data.payment_proof_url,
      shipping_full_name: data.shipping_full_name,
      shipping_address: data.shipping_address,
      shipping_city: data.shipping_city,
      shipping_phone_number: data.shipping_phone_number,
      payment_proof_uploaded_at: data.payment_proof_uploaded_at,
      status: "shipping_pending", // Chuyển status sang shipping_pending khi buyer upload payment proof
      updated_at: db.fn.now(),
    });
};

/**
 * Update transaction shipping proof and confirm payment
 * @param transactionId - Transaction ID
 * @param data - Shipping proof URL and payment confirmation (snake_case)
 */
export const updateTransactionShipping = async (
  transactionId: number,
  data: {
    shipping_proof_url: string;
    payment_confirmed_at: Date;
    shipping_proof_uploaded_at: Date;
  }
): Promise<void> => {
  await db("transactions")
    .where({ id: transactionId })
    .update({
      shipping_proof_url: data.shipping_proof_url,
      payment_confirmed_at: data.payment_confirmed_at,
      shipping_proof_uploaded_at: data.shipping_proof_uploaded_at,
      shipped_confirmed_at: data.payment_confirmed_at, // Same time as payment confirmation
      status: "delivered", // Chuyển status sang delivered khi seller upload shipping proof
      updated_at: db.fn.now(),
    });
};

/**
 * Update transaction when buyer confirms delivery
 * @param transactionId - Transaction ID
 */
export const updateTransactionDeliveryConfirmed = async (
  transactionId: number
): Promise<void> => {
  const now = new Date();
  await db("transactions")
    .where({ id: transactionId })
    .update({
      buyer_received_at: now,
      delivered_at: now,
      status: "completed",
      updated_at: db.fn.now(),
    });
};

/**
 * Update transaction with review rating and comment
 * @param transactionId - Transaction ID
 * @param data - Review data (buyer or seller rating)
 * @param isSeller - Whether the reviewer is the seller (true) or buyer (false)
 */
export const updateTransactionReview = async (
  transactionId: number,
  data: {
    rating: number;
    comment?: string;
  },
  isSeller: boolean
): Promise<void> => {
  const updateData = isSeller
    ? {
      seller_rating: data.rating,
      seller_comment: data.comment || null,
      updated_at: db.fn.now(),
    }
    : {
      buyer_rating: data.rating,
      buyer_comment: data.comment || null,
      updated_at: db.fn.now(),
    };

  await db("transactions")
    .where({ id: transactionId })
    .update(updateData);
};