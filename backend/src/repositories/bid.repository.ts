import prisma from '../database/prisma';
import { toNum } from '../utils/number.util';

export interface HighestBidder {
    current_price: number;
    highest_bidder: {
        id: number;
        full_name: string;
        positive_reviews: number;
        negative_reviews: number;
    }
}

export const findHighestBidById = async (productId: number): Promise<HighestBidder> => {
    const currentBid = await prisma.products.findUnique({
        where: { product_id: productId },
        select: {
            current_price: true,
            users_products_highest_bidder_idTousers: {
                select: {
                    id: true,
                    full_name: true,
                    positive_reviews: true,
                    negative_reviews: true
                }
            }
        }
    });

    return {
        current_price: toNum(currentBid?.current_price),
        highest_bidder: {
            id: currentBid?.users_products_highest_bidder_idTousers?.id ?? 0,
            full_name: currentBid?.users_products_highest_bidder_idTousers?.full_name ?? '',
            positive_reviews: currentBid?.users_products_highest_bidder_idTousers?.positive_reviews ?? 0,
            negative_reviews: currentBid?.users_products_highest_bidder_idTousers?.negative_reviews ?? 0,
        }
    }
}