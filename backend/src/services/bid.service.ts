import * as bidRepository from "../repositories/bid.repository";

export const getHighestBidById = async (productId: number) => {
    const highestBidder = await bidRepository.findHighestBidById(productId);
    return highestBidder;
};

export const placeBidOnProductById = async (productId: number, userId: number, bidAmount: number) => {
    // ...
};
