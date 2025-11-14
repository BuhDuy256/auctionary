// category.repository.ts
import prisma from "../database/prisma";
import { NotFoundError } from "../errors";

interface SubCategory {
    category_id: number;
    name: string;
}

export interface Category {
    data: {
        category_id: number;
        name: string;
        sub_categories: SubCategory[];
    }[];
}

export const getCategoryBySlug = async (slug: string) => {
    const category = await prisma.categories.findFirst({
        where: { slug },
        select: { category_id: true, parent_id: true }
    });

    if (!category) {
        throw new NotFoundError(`Category '${slug}' not found`);
    }

    return category;
};

export const getChildCategories = async (parentId: number) => {
    return await prisma.categories.findMany({
        where: { parent_id: parentId },
        select: { category_id: true }
    });
};

export const getCategoryIds = async (slug: string): Promise<number[]> => {
    const category = await prisma.categories.findFirst({
        where: { slug },
        select: { category_id: true, parent_id: true }
    });

    if (!category) return [];

    if (category.parent_id === null) {
        const children = await prisma.categories.findMany({
            where: { parent_id: category.category_id },
            select: { category_id: true }
        });

        return [
            category.category_id,
            ...children.map(c => c.category_id) // If no "..." syntax, it will return a nested array. Ex: [1, [2,3,4]]. We want [1,2,3,4]
        ];
    }

    return [category.category_id];
};

export const getAllCategories = async (): Promise<Category> => {
    const parents = await prisma.$queryRaw<Array<{ category_id: number; name: string }>>`
        SELECT category_id, name
        FROM categories
        WHERE parent_id IS NULL
    `;

    const result: Category['data'] = [];

    for (const parent of parents) {
        const children = await prisma.$queryRaw<SubCategory[]>`
            SELECT category_id, name
            FROM categories
            WHERE parent_id = ${parent.category_id}
        `;

        result.push({
            category_id: parent.category_id,
            name: parent.name,
            sub_categories: children ?? []
        });
    }

    return { data: result };
};
