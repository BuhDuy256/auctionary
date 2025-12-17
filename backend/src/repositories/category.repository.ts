import db from "../database/db";
import { NotFoundError } from "../errors";

/**
 * Get category by slug - used for filtering products
 */
export const getCategoryBySlug = async (slug: string) => {
  const category = await db("categories")
    .where({ slug })
    .select("id as category_id", "parent_id")
    .first();

  if (!category) {
    throw new NotFoundError(`Category '${slug}' not found`);
  }

  return category;
};

/**
 * Get all child categories for a parent category
 */
export const getChildCategories = async (parentId: number) => {
  return await db("categories")
    .where({ parent_id: parentId })
    .select("id as category_id");
};

/**
 * Get category IDs including parent and all children (for product filtering)
 */
export const getCategoryIds = async (slug: string): Promise<number[]> => {
  const category = await db("categories")
    .where({ slug })
    .select("id", "parent_id")
    .first();

  if (!category) return [];

  if (category.parent_id === null) {
    const children = await db("categories")
      .where({ parent_id: category.category_id })
      .select("id");

    return [category.id, ...children.map((c) => c.id)];
  }

  return [category.id];
};

/**
 * Get all categories (public-facing, returns snake_case)
 */
export const getAllCategories = async () => {
  return await db("categories").select("*");
};

/**
 * Get category slugs with parent slug
 */
export const getCategorySlugs = async (categoryId: number) => {
  return await db("categories as sub")
    .leftJoin("categories as parent", "sub.parent_id", "parent.id")
    .select("sub.slug as subSlug", "parent.slug as parentSlug")
    .where("sub.id", categoryId)
    .first();
};

// ========== ADMIN CATEGORY MANAGEMENT ==========

/**
 * Get all categories with hierarchy for admin dashboard
 * Returns raw database records in snake_case
 */
export const getAllCategoriesForAdmin = async () => {
  return await db("categories")
    .select("id as category_id", "name", "slug", "parent_id")
    .orderBy("id", "asc");
};

/**
 * Get category stats for admin dashboard
 * Returns raw counts in snake_case
 */
export const getCategoryStats = async () => {
  const totalResult = await db("categories")
    .count("id as total")
    .first();

  const mainResult = await db("categories")
    .where({ parent_id: null })
    .count("id as main")
    .first();

  const total = totalResult ? parseInt(totalResult.total as string) : 0;
  const main = mainResult ? parseInt(mainResult.main as string) : 0;

  return {
    total_categories: total,
    main_categories: main,
    subcategories: total - main,
  };
};

/**
 * Find category by ID - returns raw database record
 */
export const findCategoryById = async (categoryId: number) => {
  return await db("categories")
    .where({ id: categoryId })
    .select("id as category_id", "name", "slug", "parent_id")
    .first();
};

/**
 * Check if a category name already exists (case-insensitive)
 */
export const categoryNameExists = async (
  name: string,
  excludeId?: number
): Promise<boolean> => {
  let query = db("categories").whereRaw("LOWER(name) = LOWER(?)", [name]);

  if (excludeId) {
    query = query.whereNot({ id: excludeId });
  }

  const result = await query.first();
  return !!result;
};

/**
 * Check if a slug already exists
 */
export const slugExists = async (
  slug: string,
  excludeId?: number
): Promise<boolean> => {
  let query = db("categories").where({ slug });

  if (excludeId) {
    query = query.whereNot({ id: excludeId });
  }

  const result = await query.first();
  return !!result;
};

/**
 * Create a new category - returns raw database record
 */
export const createCategory = async (data: {
  name: string;
  slug: string;
  parent_id: number | null;
}) => {
  const [category] = await db("categories")
    .insert({
      name: data.name,
      slug: data.slug,
      parent_id: data.parent_id,
    })
    .returning("*");

  return category;
};

/**
 * Update a category - returns raw database record
 */
export const updateCategory = async (
  categoryId: number,
  data: {
    name?: string;
    slug?: string;
    parent_id?: number | null;
  }
) => {
  const [category] = await db("categories")
    .where({ id: categoryId })
    .update(data)
    .returning("*");

  return category;
};

/**
 * Delete a category by ID
 * Note: Will fail if products reference this category (FK constraint)
 */
export const deleteCategoryById = async (categoryId: number): Promise<void> => {
  await db("categories").where({ id: categoryId }).del();
};

/**
 * Count products in a category (for deletion validation)
 */
export const countProductsInCategory = async (
  categoryId: number
): Promise<number> => {
  const result = await db("products")
    .where({ category_id: categoryId })
    .count("product_id as total")
    .first();

  return result ? parseInt(result.total as string) : 0;
};

/**
 * Check if deleting a category would create orphaned subcategories
 */
export const hasSubcategories = async (
  categoryId: number
): Promise<boolean> => {
  const result = await db("categories")
    .where({ parent_id: categoryId })
    .count("id as total")
    .first();

  const count = result ? parseInt(result.total as string) : 0;
  return count > 0;
};

/**
 * Check for circular parent reference
 * Returns true if setting parentId would create a cycle
 */
export const wouldCreateCircularReference = async (
  categoryId: number,
  parentId: number
): Promise<boolean> => {
  if (categoryId === parentId) return true;

  // Check if parentId is a descendant of categoryId
  let currentId: number | null = parentId;

  while (currentId !== null) {
    if (currentId === categoryId) return true;

    const parent: { parent_id: number | null } = await db("categories")
      .where({ id: currentId })
      .select("parent_id")
      .first();

    currentId = parent.parent_id;
  }

  return false;
};

/**
 * Get category depth (0 = root, 1 = subcategory, etc.)
 */
export const getCategoryDepth = async (categoryId: number): Promise<number> => {
  let depth = 0;
  let currentId: number | null = categoryId;

  while (currentId !== null) {
    const category: { parent_id: number | null } = await db("categories")
      .where({ id: currentId })
      .select("parent_id")
      .first();

    if (!category) break;

    if (category.parent_id === null) break;

    depth++;
    currentId = category.parent_id;
  }

  return depth;
};
