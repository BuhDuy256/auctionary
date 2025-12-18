import {
  Category,
  AdminCategoryTreeNode,
  AdminCategoryListResponse,
  AdminCategoryResponse,
} from "../api/dtos/responses/category.type";

/**
 * Map raw database categories to public Category format with hierarchy
 * Used for product filters and public category navigation
 */
export const mapToCategories = (rawCategories: any[]): Category[] => {
  const parents = rawCategories.filter((c) => c.parent_id === null);

  return parents.map((parent) => ({
    id: parent.id,
    slug: parent.slug,
    name: parent.name,
    children: rawCategories
      .filter((c) => c.parent_id === parent.id)
      .map((child) => ({
        id: child.id,
        slug: child.slug,
        name: child.name,
      })),
  }));
};

/**
 * Build hierarchical tree from flat category records
 * Recursively builds subcategories for admin dashboard
 */
const buildCategoryTree = (
  categories: any[],
  parentId: number | null = null
): AdminCategoryTreeNode[] => {
  return categories
    .filter((c) => c.parent_id === parentId)
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: category.parent_id,
      subcategories: buildCategoryTree(categories, category.id),
    }));
};

/**
 * Map raw database categories to admin tree structure
 */
export const mapToAdminCategoryTree = (
  rawCategories: any[]
): AdminCategoryTreeNode[] => {
  return buildCategoryTree(rawCategories, null);
};

/**
 * Map raw database stats to AdminCategoryListResponse
 */
export const mapToAdminCategoryListResponse = (
  rawCategories: any[],
  rawStats: {
    total_categories: number;
    main_categories: number;
    subcategories: number;
  }
): AdminCategoryListResponse => {
  return {
    categories: mapToAdminCategoryTree(rawCategories),
    stats: {
      totalCategories: rawStats.total_categories,
      mainCategories: rawStats.main_categories,
      subcategories: rawStats.subcategories,
    },
  };
};

/**
 * Map single raw category record to admin response
 */
export const mapToAdminCategoryResponse = (
  rawCategory: any
): AdminCategoryResponse => {
  return {
    id: rawCategory.id,
    name: rawCategory.name,
    slug: rawCategory.slug,
    parentId: rawCategory.parent_id,
  };
};
