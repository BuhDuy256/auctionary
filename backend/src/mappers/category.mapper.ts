import { Category } from "../api/dtos/responses/category.type";

export const mapToCategories = (rawCategories: any[]): Category[] => {
  const parents = rawCategories.filter((c) => c.parent_id === null);

  return parents.map((parent) => ({
    id: parent.category_id,
    slug: parent.slug,
    name: parent.name,
    children: rawCategories
      .filter((c) => c.parent_id === parent.category_id)
      .map((child) => ({
        id: child.category_id,
        slug: child.slug,
        name: child.name,
      })),
  }));
};
