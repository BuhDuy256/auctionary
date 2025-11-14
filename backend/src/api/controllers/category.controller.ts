import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../../services/category.services';

export const getAllCategories = async (
    _request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const result = await categoryService.getAllCategories();
        
        response.status(200).json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error('[getAllCategories] Error:', error);
        next(error);
    }
};