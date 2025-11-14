// product.repository.ts
import prisma from "../database/prisma"
import { toSlug } from "../utils/slug.util";
import { getCategoryIds } from "./category.repository";

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

function escapeQuery(q: string) {
    return q
        .replace(/[-:!&|]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export const fullTextSearch = async (q: string, page: number, limit: number) => {
    const safeQ = escapeQuery(q);
    const offset = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
        prisma.$queryRaw`
            SELECT 
                product_id,
                thumbnail_url,
                name,
                current_price,
                highest_bidder_id,
                status,
                start_time,
                end_time,
                bid_count,
                ts_rank(fts, websearch_to_tsquery('english', ${safeQ})) AS relevance
            FROM products
            WHERE 
                fts @@ websearch_to_tsquery('english', ${safeQ})
                AND status = 'active'
                AND end_time > NOW()
            ORDER BY relevance DESC
            LIMIT ${limit}::bigint
            OFFSET ${offset}::bigint
        `,
        prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(*) as count
            FROM products
            WHERE 
                fts @@ websearch_to_tsquery('english', ${safeQ})
                AND status = 'active'
                AND end_time > NOW()
        `
    ]);

    const total = Number(totalCount[0].count);

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    };
};


export const findByCategory = async (categorySlug: string, page: number, limit: number): Promise<PaginatedResult<any>> => {
    const slug = toSlug(categorySlug);
    const offset = (page - 1) * limit;

    const categoryIds = await getCategoryIds(slug);

    const [products, total] = await Promise.all([
        prisma.products.findMany({
            where: {
                category_id: { in: categoryIds },
                status: 'active',
                end_time: { gt: new Date() }
            },
            select: {
                product_id: true,
                thumbnail_url: true,
                name: true,
                current_price: true,
                highest_bidder_id: true,
                status: true,
                start_time: true,
                end_time: true,
                bid_count: true,
                categories: {
                    select: {
                        category_id: true,
                        name: true,
                        slug: true
                    }
                },
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset
        }),

        prisma.products.count({
            where: {
                category_id: { in: categoryIds },
                status: 'active',
                end_time: { gt: new Date() }
            }
        })
    ]);

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    };
};