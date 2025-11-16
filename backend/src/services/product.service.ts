import * as productRepository from '../repositories/product.repository';
import { productSearchQuerySchema } from '../api/schemas/product.schema';

export const searchProducts = async (query: any) => {
    // Default values are handled in validate middleware
    const { q, category, page, limit, sort } = productSearchQuerySchema.parse(query);

    // Handle empty q & category in validate middleware

    if (category) {
        const result = await productRepository.findByCategory(category, page, limit, sort);
        // Don't need to throw NotFoundError here, just return empty result and let frontend handle it
        // if (result.data.length === 0) {
        //     throw new NotFoundError(`No products found for category: ${categorySlug}`);
        // }
        return result;
    }

    return await productRepository.fullTextSearch(q, page, limit, sort);
};

