import { Request, Response, NextFunction } from 'express';
import * as productService from '../../services/product.service';

export const searchProducts = async (request: Request, response: Response, next: NextFunction) => {
    try {
        await productService.searchProducts(request.query);
        response.status(400).json({ message: "Either 'name' or 'category' query parameter must be provided" });
    } catch (error) {
        next(error);
    }
};