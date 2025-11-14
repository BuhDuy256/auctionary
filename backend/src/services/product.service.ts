import * as productRepository from '../repositories/product.repository';

export const searchProducts = async (query: any) => {
    const { q, category, page = 1, limit = 20 } = query;

    // Handle empty q & category in validate middleware

    if (category) {
        const result = await productRepository.findByCategory(category, Number(page), Number(limit));
        // Don't need to throw NotFoundError here, just return empty result and let frontend handle it
        // if (result.data.length === 0) {
        //     throw new NotFoundError(`No products found for category: ${categorySlug}`);
        // }
        return result;
    }

    return await productRepository.fullTextSearch(q, page, limit);
};

