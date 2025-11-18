import { Request, Response, NextFunction } from 'express';
import * as bidService from '../../services/bid.service';

export const getHighestBidById = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const result = await bidService.getHighestBidById(Number(request.params.id));
        response .status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[getHighestBidById] Error:', error);
        next(error);
    }
};

export const placeBidOnProductById = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        //...
    }
    catch (error) {
        console.error('[placeBidOnProductById] Error:', error);
        next(error);
    }
};