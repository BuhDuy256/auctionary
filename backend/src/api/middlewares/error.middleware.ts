import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors';
import { ZodError } from 'zod';
import { envConfig } from '../../configs/env.config';
import { ErrorResponse } from '../dtos/responses/api-response.type';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response<ErrorResponse> => {
  let response: ErrorResponse = {
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
  };

  let statusCode = 500;

  // 1. AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    response = {
      success: false,
      error: error.constructor.name.replace('Error', '').toUpperCase(), // VD: BAD_REQUEST, NOT_FOUND
      message: error.message,
    };
  }

  // 2. ZodError
  else if (error instanceof ZodError) {
    statusCode = 400;
    response = {
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      details: error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  // 3. JWT Errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    response = {
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid token',
    };
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    response = {
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Token has expired',
    };
  }

  // 4. PostgreSQL Errors
  else if ((error as any).code) {
    const pgError = error as any;
    if (pgError.code === '23505') {
      statusCode = 409;
      response = {
        success: false,
        error: 'DUPLICATE_ENTRY',
        message: 'Resource already exists',
        details: pgError.detail,
      };
    } else if (pgError.code === '23503') {
      statusCode = 400;
      response = {
        success: false,
        error: 'INVALID_REFERENCE',
        message: 'Invalid reference ID',
        details: pgError.detail,
      };
    }
  }

  // 5. Generic Errors (Dev mode details)
  if (envConfig.NODE_ENV === 'development' && statusCode === 500) {
    response.message = error.message;
    response.details = error.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * Catches all requests to non-existent routes
 * Should be placed AFTER all route definitions
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  };
  return res.status(404).json(response);
};
