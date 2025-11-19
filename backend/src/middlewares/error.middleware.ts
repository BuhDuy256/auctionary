import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
            ...(error instanceof ValidationError && { details: error.details }),
        });
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry',
                field: error.meta?.target,
            });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Record not found',
            });
        }
        return res.status(400).json({
            success: false,
            error: 'Database error',
            ...(process.env.NODE_ENV === 'development' && { 
                details: error.message 
            }),
        });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            success: false,
            error: 'Invalid database query',
            ...(process.env.NODE_ENV === 'development' && { 
                details: error.message 
            }),
        });
    }

    return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { 
            message: error.message,
            stack: error.stack 
        }),
    });
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    return res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
    });
};
