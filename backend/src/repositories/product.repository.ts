import { Knex } from "knex";
import db from "../database/db";
import { toSlug } from "../utils/slug.util";
import { getCategoryIds } from "./category.repository";
import {
  SortOption,
  UpdateProductConfig,
} from "../api/dtos/requests/product.schema";
import { toNum } from "../utils/number.util";

function escapeQuery(q: string) {
  return q
    .replace(/[-:!&|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const getProductBasicInfoById = async (productId: number) => {
  const product = await db("products")
    .where("products.id", productId)
    .select("products.id", "products.name", "products.status")
    .first();

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const searchProducts = async (
  q?: string,
  categorySlugs?: string[],
  page: number = 1,
  limit: number = 10,
  sort?: SortOption,
  excludeCategorySlugs?: string[],
  excludeProductIds?: number[]
): Promise<{ data: any[]; total: number }> => {
  const offset = (page - 1) * limit;

  let query = db("products").whereIn("products.status", [
    "active",
    "sold",
    "expired",
  ]);

  if (q) {
    const safeQ = escapeQuery(q);
    query = query.where("products.name", "ilike", `%${safeQ}%`);
  }

  if (categorySlugs && categorySlugs.length > 0) {
    const allCategoryIds: number[] = [];
    for (const slug of categorySlugs) {
      const normalizedSlug = toSlug(slug);
      const categoryIds = await getCategoryIds(normalizedSlug);
      allCategoryIds.push(...categoryIds);
    }
    if (allCategoryIds.length > 0) {
      const uniqueCategoryIds = [...new Set(allCategoryIds)];
      query = query.whereIn("products.category_id", uniqueCategoryIds);
    }
  }

  if (excludeCategorySlugs && excludeCategorySlugs.length > 0) {
    const excludeCategoryIds = [];
    for (const slug of excludeCategorySlugs) {
      const ids = await getCategoryIds(toSlug(slug));
      excludeCategoryIds.push(...ids);
    }
    if (excludeCategoryIds.length > 0) {
      query = query.whereNotIn("products.category_id", excludeCategoryIds);
    }
  }

  if (excludeProductIds && excludeProductIds.length > 0) {
    query = query.whereNotIn("products.id", excludeProductIds);
  }

  // Count with DISTINCT to avoid counting duplicates
  const countQuery = query.clone().countDistinct("products.id as total").first();

  // Order by status priority first: active > sold > expired
  query = query.orderByRaw(
    `CASE 
      WHEN products.status = 'active' THEN 1 
      WHEN products.status = 'sold' THEN 2 
      WHEN products.status = 'expired' THEN 3 
      ELSE 4 
    END`
  );

  // Then apply user's custom sort or default sort
  if (sort && Array.isArray(sort) && sort.length > 0) {
    sort.forEach((item) => {
      const dbField =
        item.field === "endTime"
          ? "products.end_time"
          : item.field === "price"
            ? "products.current_price"
            : item.field === "bidCount"
              ? "products.bid_count"
              : item.field === "createdAt"
                ? "products.created_at"
                : "products.created_at";
      query = query.orderBy(dbField, item.direction);
    });
  } else {
    query = query.orderBy("products.end_time", "asc");
  }

  // Always add products.id as final tiebreaker for consistent pagination
  query = query.orderBy("products.id", "asc");

  // Execute query with joins
  const products = await query
    .leftJoin("users", "products.highest_bidder_id", "users.id")
    .select(
      "products.id",
      "products.slug",
      "products.thumbnail_url",
      "products.name",
      "products.current_price",
      "products.buy_now_price",
      "products.status",
      "products.created_at",
      "products.end_time",
      "products.bid_count",
      "products.highest_bidder_id",
      "products.seller_id",
      "users.full_name as bidder_name"
    )
    .limit(limit)
    .offset(offset);

  const totalResult = await countQuery;
  const total = totalResult ? parseInt(totalResult.total as string) : 0;

  return { data: products, total };
};

export const createProduct = async (data: {
  name: string;
  category_id: number;
  seller_id: number;
  start_price: number;
  step_price: number;
  buy_now_price?: number;
  end_time: Date;
  auto_extend: boolean;
  description: string;
  thumbnail_url: string;
  image_urls: string[];
  allow_new_bidder?: boolean;
}) => {
  return await db.transaction(async (tx) => {
    const [product] = await tx("products")
      .insert({
        name: data.name,
        category_id: data.category_id,
        seller_id: data.seller_id,
        start_price: data.start_price,
        current_price: data.start_price,
        step_price: data.step_price,
        buy_now_price: data.buy_now_price,
        end_time: data.end_time,
        auto_extend: data.auto_extend,
        thumbnail_url: data.thumbnail_url,
        status: "active",
      })
      .returning("*");

    await tx("product_configs").insert({
      product_id: product.id,
      allow_new_bidder: data.allow_new_bidder ?? true,
    });

    await tx("product_descriptions").insert({
      product_id: product.id,
      author_id: data.seller_id,
      content: data.description,
      lang: "vi",
      version: 1,
    });

    if (data.image_urls.length > 0) {
      await tx("product_images").insert(
        data.image_urls.map((image_url) => ({
          product_id: product.id,
          image_url,
        }))
      );
    }

    return product;
  });
};

export const findDetailById = async (productId: number) => {
  const product = await db("products").where({ id: productId }).first();

  if (!product) {
    return null;
  }

  const [images, seller, description, category] = await Promise.all([
    db("product_images")
      .where({ product_id: productId })
      .orderBy("id", "asc")
      .select("image_url"),
    db("users")
      .where({ id: product.seller_id })
      .select("id", "full_name", "positive_reviews", "negative_reviews")
      .first(),
    db("product_descriptions")
      .where({ product_id: productId, lang: "vi" })
      .orderBy("version", "desc")
      .select("content")
      .first(),
    db("categories").where({ id: product.category_id }).first(),
    db("product_configs")
      .where({ product_id: productId })
      .select("allow_new_bidder")
      .first(),
  ]);

  let parentCategory = null;
  if (category && category.parent_id) {
    parentCategory = await db("categories")
      .where({ id: category.parent_id })
      .select("id", "name", "slug")
      .first();
  }

  return {
    ...product,
    images: images,
    seller: seller,
    description: description,
    category: {
      ...category,
      parent: parentCategory,
    },
  };
};

export const findCommentsById = async (
  productId: number,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const parentComments = await db("product_comments")
    .join("users", "product_comments.user_id", "users.id")
    .where({
      "product_comments.product_id": productId,
      "product_comments.parent_id": null,
    })
    .select("product_comments.*", "users.full_name")
    .orderBy("product_comments.created_at", "desc")
    .limit(limit)
    .offset(offset);

  const totalResult = await db("product_comments")
    .where({
      product_id: productId,
      parent_id: null,
    })
    .count("id as total")
    .first();

  const total = totalResult ? parseInt(totalResult.total as string) : 0;

  // Fetch replies for these comments
  const commentIds = parentComments.map((c) => c.id);
  const replies = await db("product_comments")
    .join("users", "product_comments.user_id", "users.id")
    .whereIn("product_comments.parent_id", commentIds)
    .select("product_comments.*", "users.full_name")
    .orderBy("product_comments.created_at", "asc");

  const repliesMap = new Map<number, any[]>();
  replies.forEach((r) => {
    if (!repliesMap.has(r.parent_id)) {
      repliesMap.set(r.parent_id, []);
    }
    repliesMap.get(r.parent_id)?.push(r);
  });

  const data = parentComments.map((comment) => ({
    ...comment,
    replies: repliesMap.get(comment.id) || [],
  }));

  return {
    data,
    total,
  };
};

export const getStepPriceById = async (productId: number): Promise<number> => {
  const product = await db("products")
    .where({ id: productId })
    .select("step_price")
    .first();
  return toNum(product?.step_price);
};

export const getStartPriceById = async (productId: number): Promise<number> => {
  const product = await db("products")
    .where({ id: productId })
    .select("start_price")
    .first();
  return toNum(product?.start_price);
};

export const getHighestBidderId = async (
  productId: number
): Promise<number | null> => {
  const product = await db("products")
    .where({ id: productId })
    .select("highest_bidder_id")
    .first();
  return product?.highest_bidder_id ?? null;
};

export const updateProductBidStats = async (
  productId: number,
  highestBidderId: number,
  currentPrice: number,
  trx?: Knex.Transaction
): Promise<void> => {
  await (trx || db)("products")
    .where({ id: productId })
    .update({
      highest_bidder_id: highestBidderId,
      current_price: currentPrice,
    })
    .increment("bid_count", 1);
};

export const increaseProductBidCount = async (
  productId: number,
  trx?: Knex.Transaction
): Promise<void> => {
  await (trx || db)("products")
    .where({ id: productId })
    .increment("bid_count", 1);
};

export const appendProductDescription = async (
  productId: number,
  sellerId: number,
  content: string
): Promise<void> => {
  const latestDescription = await db("product_descriptions")
    .where({ product_id: productId })
    .orderBy("version", "desc")
    .select("version")
    .first();

  const newVersion = (latestDescription?.version ?? 0) + 1;

  await db("product_descriptions").insert({
    product_id: productId,
    author_id: sellerId,
    content: content,
    version: newVersion,
    lang: "vi",
  });
};

export const appendProductQuestion = async (
  productId: number,
  questionerId: number,
  content: string
): Promise<void> => {
  await db("product_comments").insert({
    product_id: productId,
    user_id: questionerId,
    content: content,
  });
};

export const appendProductAnswer = async (
  productId: number,
  questionId: number,
  answererId: number,
  content: string
): Promise<void> => {
  await db("product_comments").insert({
    product_id: productId,
    user_id: answererId,
    content: content,
    parent_id: questionId,
  });
};

export const getProductBidInfo = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  const product = await (trx || db)("products")
    .leftJoin("product_configs", "products.id", "product_configs.product_id")
    .where({ "products.id": productId })
    .select(
      "products.step_price",
      "products.start_price",
      "products.current_price",
      "products.highest_bidder_id",
      "products.seller_id",
      "products.status",
      "product_configs.allow_new_bidder"
    )
    .forUpdate("products")
    .first();

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// Product Detail Page Methods
export const getProductDetailById = async (productId: number) => {
  const product = await db("products")
    .leftJoin("categories", "products.category_id", "categories.id")
    .leftJoin("users as seller", "products.seller_id", "seller.id")
    .leftJoin("users as bidder", "products.highest_bidder_id", "bidder.id")
    .leftJoin("product_configs", "products.id", "product_configs.product_id")
    .where("products.id", productId)
    .select(
      "products.*",
      "categories.id as category_id",
      "categories.name as category_name",
      "categories.slug as category_slug",
      "categories.parent_id",
      "seller.id as seller_id",
      "seller.full_name as seller_name",
      "seller.positive_reviews",
      "seller.negative_reviews",
      "bidder.full_name as bidder_name",
      "product_configs.allow_new_bidder"
    )
    .first();

  return product;
};

export const getProductBidCount = async (
  productId: number,
  trx?: Knex.Transaction
): Promise<number> => {
  const product = await (trx || db)("products")
    .where({ id: productId })
    .select("products.bid_count")
    .first();
  return product?.bid_count || 0;
};

export const getProductImages = async (productId: number) => {
  return await db("product_images")
    .where({ product_id: productId })
    .select("image_url")
    .orderBy("id", "asc");
};

export const getProductDescription = async (productId: number) => {
  return await db("product_descriptions")
    .where({ product_id: productId })
    .orderBy("created_at", "asc")
    .select("content", "created_at as created_at");
};

export const getCategoryWithParents = async (categoryId: number) => {
  const categories = await db.raw(
    `
    WITH RECURSIVE category_path AS (
      SELECT id, name, slug, parent_id, 0 as level
      FROM categories 
      WHERE id = ?
      
      UNION ALL
      
      SELECT c.id, c.name, c.slug, c.parent_id, cp.level + 1
      FROM categories c 
      INNER JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT * FROM category_path ORDER BY level DESC
  `,
    [categoryId]
  );

  return categories.rows || [];
};

export const getWatchlistCount = async (productId: number) => {
  const result = await db("watchlist")
    .where({ product_id: productId })
    .count("user_id as total")
    .first();

  return result ? parseInt(result.total as string) : 0;
};

export const isUserWatchlisted = async (userId: number, productId: number) => {
  const result = await db("watchlist")
    .where({ user_id: userId, product_id: productId })
    .first();

  return !!result;
};

export const getUserBidStatus = async (userId: number, productId: number) => {
  // Check if user has placed any bid (manual or auto)
  const manualBid = await db("bids")
    .where({ bidder_id: userId, product_id: productId })
    .first();

  const autoBid = await db("auto_bids")
    .where({ bidder_id: userId, product_id: productId })
    .select("max_amount")
    .first();

  return {
    hasPlacedBid: !!(manualBid || autoBid),
    currentUserMaxBid: autoBid?.max_amount
      ? parseFloat(autoBid.max_amount)
      : undefined,
  };
};

export const getUserRejectionStatus = async (
  userId: number,
  productId: number
) => {
  const rejection = await db("product_rejections")
    .where({ bidder_id: userId, product_id: productId })
    .select("reason", "created_at")
    .orderBy("created_at", "desc")
    .first();

  return {
    isRejected: !!rejection,
    rejectionReason: rejection?.reason || undefined,
  };
};

export const getProductQuestions = async (
  productId: number,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;

  // Get parent comments (questions) with user info
  const questions = await db("product_comments as pc")
    .leftJoin("users as asker", "pc.user_id", "asker.id")
    .where({
      "pc.product_id": productId,
      "pc.parent_id": null,
    })
    .select(
      "pc.id",
      "pc.content as question",
      "pc.created_at",
      "asker.full_name as asker_name"
    )
    .orderBy("pc.created_at", "desc")
    .limit(limit)
    .offset(offset);

  // Get first reply (answer) for each question
  const questionIds = questions.map((q) => q.id);
  const answers = await db("product_comments as reply")
    .leftJoin("users as answerer", "reply.user_id", "answerer.id")
    .whereIn("reply.parent_id", questionIds)
    .select(
      "reply.parent_id",
      "reply.content as answer",
      "reply.created_at as answered_at",
      "answerer.full_name as answerer_name"
    )
    .orderBy("reply.created_at", "asc");

  // Map answers to questions (first answer only)
  const answerMap = new Map();
  answers.forEach((a) => {
    if (!answerMap.has(a.parent_id)) {
      answerMap.set(a.parent_id, a);
    }
  });

  // Get total count
  const totalResult = await db("product_comments")
    .where({ product_id: productId, parent_id: null })
    .count("id as total")
    .first();

  const total = totalResult ? parseInt(totalResult.total as string) : 0;

  return {
    questions: questions.map((q) => ({
      ...q,
      answer: answerMap.get(q.id) || null,
    })),
    total,
  };
};

export const getProductBidHistory = async (
  productId: number,
  page: number = 1,
  limit: number = 20
) => {
  const offset = (page - 1) * limit;

  const bids = await db("bids")
    .leftJoin("users", "bids.bidder_id", "users.id")
    .where("bids.product_id", productId)
    .select(
      "bids.id",
      "bids.amount",
      "bids.created_at",
      "users.full_name as bidder_name",
      "bids.bidder_id"
    )
    .orderBy("bids.amount", "desc")
    .orderBy("bids.created_at", "asc")
    .limit(limit)
    .offset(offset);

  const totalResult = await db("bids")
    .where({ product_id: productId })
    .count("id as total")
    .first();

  const total = totalResult ? parseInt(totalResult.total as string) : 0;

  const product = await db("products")
    .where({ id: productId })
    .select("highest_bidder_id", "current_price")
    .first();

  // Mark top bid
  if (product) {
    for (const bid of bids) {
      if (
        bid.bidder_id === product.highest_bidder_id &&
        Math.abs(bid.amount - product.current_price) < 0.01
      ) {
        bid.isTopBid = true;
        break;
      }
    }
  }

  return { bids, total };
};

export const updateProductConfig = async (
  productId: number,
  body: UpdateProductConfig
) => {
  await db("product_configs").where({ product_id: productId }).update({
    allow_new_bidder: body.allowNewBidder,
  });
};

export const getProductSellerId = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  const product = await (trx || db)("products")
    .where({ id: productId })
    .select("seller_id")
    .first();
  return product?.seller_id ?? null;
};

export const getProductBasicData = async (
  productId: number,
  trx?: Knex.Transaction
) => {
  const product = await (trx || db)("products")
    .where({ id: productId })
    .select("step_price", "start_price")
    .first();
  return product;
};

export const updateProductAuctionState = async (
  productId: number,
  data: {
    highest_bidder_id: number | null;
    current_price: number;
    bid_count: number;
  },
  trx?: Knex.Transaction
): Promise<void> => {
  await (trx || db)("products").where({ id: productId }).update(data);
};

export const getProductSeller = async (productId: number) => {
  return await db("products")
    .join("users", "products.seller_id", "users.id")
    .where("products.id", productId)
    .select("users.email", "users.full_name")
    .first();
};

export const getProductQuestionById = async (questionId: number) => {
  return await db("product_comments").where("id", questionId).first();
};

export const updateProductEndTime = async (
  productId: number,
  newEndTime: Date
) => {
  await db("products")
    .where({ id: productId })
    .update({ end_time: newEndTime });
};

export const updateProductStatus = async (
  productId: number,
  status: string,
  trx?: Knex.Transaction
): Promise<void> => {
  await (trx || db)("products").where({ id: productId }).update({ status });
};
