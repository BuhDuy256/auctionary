import * as productRepository from "../repositories/product.repository";
import { SortOption } from "../api/schemas/product.schema";

export const searchProducts = async (query: any) => {
  const { q, category, page, limit, sort, exclude } = query;

  if (category) {
    return await productRepository.findByCategory(
      category,
      page,
      limit,
      sort,
      exclude
    );
  }

  return await productRepository.fullTextSearch(q, page, limit, sort, exclude);
};

export const createProduct = async (data: {
  name: string;
  categoryId: number;
  sellerId: number;
  startPrice: number;
  stepPrice: number;
  buyNowPrice?: number;
  description: string;
  endTime: Date;
  autoExtend: string;
  thumbnail: string;
  images: string[];
}) => {
  const product = await productRepository.createProduct({
    name: data.name,
    category_id: data.categoryId,
    seller_id: data.sellerId,
    start_price: data.startPrice,
    step_price: data.stepPrice,
    buy_now_price: data.buyNowPrice,
    end_time: data.endTime,
    auto_extend: data.autoExtend === "yes",
    description: data.description,
    thumbnail: data.thumbnail,
    images: data.images,
  });

  return {
    productId: product.product_id,
    name: product.name,
    status: product.status,
  };
};

export const getProductDetailById = async (productId: number) => {
  const product = await productRepository.findDetailById(productId);
  return product;
};

export const getProductCommentsById = async (params: any, query: any) => {
  const productId = Number(params.id);
  const { page, limit } = query;
  return await productRepository.findCommentsById(productId, page, limit);
};

export const appendProductDescription = async (params: any, body: any) => {
  const productId = Number(params.id);
  const { sellerId, content } = body;
  await productRepository.appendProductDescription(
    productId,
    sellerId,
    content
  );
};
