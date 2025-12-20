import * as TransactionService from '../../services/transaction.service';
import { Request, Response, NextFunction } from 'express';
import {
  TransactionPaymentProofUploadRequest,
  TransactionShippingProofUploadRequest,
  TransactionDeliveryConfirmRequest,
  TransactionReviewSubmitRequest
} from '../dtos/requests/transaction.schema';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number | string;
    roles?: string[];
    permissions?: string[];
  };
}

export const getTransactionDetail = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const transactionId = Number(request.params.id);
    const transaction = await TransactionService.getTransactionDetail(transactionId);
    response.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
}

export const uploadPaymentProof = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const transactionId = Number(request.params.id);
    const file = request.file;

    if (!file) {
      return next(new Error('Payment proof file is required'));
    }

    // Cast request body to DTO type
    const data = request.body as TransactionPaymentProofUploadRequest;

    await TransactionService.uploadPaymentProof(transactionId, data, file);

    response
      .status(200)
      .json({
        success: true,
        message: 'Payment proof uploaded successfully',
      });
  } catch (error) {
    next(error);
  }
};

export const uploadShippingProof = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const transactionId = Number(request.params.id);
    const file = request.file;

    if (!file) {
      return next(new Error('Shipping proof file is required'));
    }

    // Cast request body to DTO type
    const data = request.body as TransactionShippingProofUploadRequest;

    await TransactionService.uploadShippingProof(transactionId, data, file);

    response
      .status(200)
      .json({
        success: true,
        message: 'Shipping proof uploaded successfully',
      });
  } catch (error) {
    next(error);
  }
};

export const confirmDelivery = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const transactionId = Number(request.params.id);
    const data = request.body as TransactionDeliveryConfirmRequest;

    await TransactionService.confirmDelivery(transactionId, data);

    response
      .status(200)
      .json({
        success: true,
        message: 'Delivery confirmed successfully',
      });
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const transactionId = Number(request.params.id);
    const userId = (request as AuthenticatedRequest).user?.id;

    if (!userId) {
      return next(new Error('User not authenticated'));
    }

    const data = request.body as TransactionReviewSubmitRequest;

    await TransactionService.submitReview(transactionId, userId, data);

    response
      .status(200)
      .json({
        success: true,
        message: 'Review submitted successfully',
      });
  } catch (error) {
    next(error);
  }
};