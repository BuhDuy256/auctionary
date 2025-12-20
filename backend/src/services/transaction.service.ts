import * as TransactionRepository from '../repositories/transaction.repository';
import * as UserRepository from '../repositories/user.repository';
import * as storageService from './storage.service';
import { ForbiddenError, NotFoundError } from '../errors';
import { TransactionDetailResponse, TransactionMessage } from '../api/dtos/responses/transaction.type';
import { mapTransactionDetailToResponse } from '../mappers/transaction.mapper';
import {
  TransactionPaymentProofUploadRequest,
  TransactionShippingProofUploadRequest,
  TransactionDeliveryConfirmRequest,
  TransactionReviewSubmitRequest
} from '../api/dtos/requests/transaction.schema';

export const verifyUserOwnership = async (userId: number, transactionId: number): Promise<void> => {
  const transaction = await TransactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  if (transaction.buyer_id !== userId && transaction.seller_id !== userId) {
    throw new ForbiddenError('User does not own this transaction');
  }
}

export const getTransactionDetail = async (transactionId: number): Promise<TransactionDetailResponse> => {
  const transactionRaw = await TransactionRepository.findTransactionDetailById(transactionId);

  if (!transactionRaw) {
    throw new NotFoundError('Transaction not found');
  }

  const messagesRaw = await TransactionRepository.findTransactionMessages(transactionId);

  const messages: TransactionMessage[] = messagesRaw.map(msg => ({
    id: msg.id,
    senderId: msg.sender_id,
    content: msg.content,
    createdAt: msg.created_at,
  }));

  return mapTransactionDetailToResponse(transactionRaw, messages);
}

export const uploadPaymentProof = async (
  transactionId: number,
  data: TransactionPaymentProofUploadRequest,
  file: Express.Multer.File
): Promise<void> => {
  const transaction = await TransactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  const timestamp = Date.now();
  const storagePath = `transactions/${transactionId}/payment/proof_${timestamp}.png`;

  const proofUrl = await storageService.uploadFile(
    "auctionary-transaction-proofs",
    file,
    storagePath
  );

  await TransactionRepository.updateTransactionPayment(transactionId, {
    payment_proof_url: proofUrl,
    shipping_full_name: data.shippingFullName,
    shipping_address: data.shippingAddress,
    shipping_city: data.shippingCity,
    shipping_phone_number: data.shippingPhoneNumber,
    payment_proof_uploaded_at: new Date(),
  });
};

/**
 * Upload shipping proof and confirm payment received
 * @param transactionId - Transaction ID
 * @param data - Shipping proof data (paymentConfirmed validated by Zod)
 * @param file - Uploaded shipping proof file
 * @returns Promise<void>
 */
export const uploadShippingProof = async (
  transactionId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: TransactionShippingProofUploadRequest, // Validated by schema, not used in logic
  file: Express.Multer.File
): Promise<void> => {
  // Verify transaction exists
  const transaction = await TransactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  // Upload file to Supabase
  const timestamp = Date.now();
  const storagePath = `transactions/${transactionId}/shipping/proof_${timestamp}.png`;

  const proofUrl = await storageService.uploadFile(
    "auctionary-transaction-proofs",
    file,
    storagePath
  );

  // Update transaction with shipping proof and payment confirmation
  const now = new Date();
  await TransactionRepository.updateTransactionShipping(transactionId, {
    shipping_proof_url: proofUrl,
    payment_confirmed_at: now,
    shipping_proof_uploaded_at: now,
  });
};

/**
 * Confirm delivery - buyer received the item
 * @param transactionId - Transaction ID
 * @param data - Delivery confirmation (validated by Zod)
 * @returns Promise<void>
 */
export const confirmDelivery = async (
  transactionId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: TransactionDeliveryConfirmRequest
): Promise<void> => {
  const transaction = await TransactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  await TransactionRepository.updateTransactionDeliveryConfirmed(transactionId);
};

/**
 * Submit review for transaction partner (buyer rates seller or vice versa)
 * @param transactionId - Transaction ID
 * @param userId - Current user ID (reviewer)
 * @param data - Review data (rating and optional comment)
 * @returns Promise<void>
 */
export const submitReview = async (
  transactionId: number,
  userId: number | string,
  data: TransactionReviewSubmitRequest
): Promise<void> => {
  // Verify transaction exists and get details
  const transaction = await TransactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  // Verify user is part of this transaction
  const isSeller = transaction.seller_id === userId;
  const isBuyer = transaction.buyer_id === userId;

  if (!isSeller && !isBuyer) {
    throw new ForbiddenError('User does not own this transaction');
  }

  // Update transaction with review
  await TransactionRepository.updateTransactionReview(
    transactionId,
    {
      rating: data.rating,
      comment: data.comment,
    },
    isSeller
  );

  // Update the reviewee's score
  const revieweeId = isSeller ? transaction.buyer_id : transaction.seller_id;
  if (revieweeId) {
    await UserRepository.updateUserReviewScore(revieweeId, data.rating === 1);
  }
};