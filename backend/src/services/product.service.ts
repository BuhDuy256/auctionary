import * as productRepository from '../repositories/product.repository';

export const searchProducts = async (query: any) => {
    if (query.name) {
        return await productRepository.fullTextSearch(query.name, query.page || 1, query.limit || 20);
    } else if (query.category) {
        return await productRepository.findByCategory(query.category, query.page || 1, query.limit || 20);
    }
    throw new Error("Either 'name' or 'category' query parameter must be provided");
}

