import * as categoryRepository from '../repositories/category.repository';
import { Category } from '../types/category.type';

export const mapCategoriesToTree = (categories: any[]): Category[] => {
  const parents = categories.filter((c) => c.parent_id === null);

  return parents.map((parent) => ({
    slug: parent.slug,
    name: parent.name,
    children: categories
      .filter((c) => c.parent_id === parent.category_id)
      .map((child) => ({
        slug: child.slug,
        name: child.name,
      })),
  }));
};

export const getAllCategories = async (): Promise<Category[]> => {
  const categories = await categoryRepository.getAllCategories();

  const parents = categories.filter((c) => c.parent_id === null);

  return parents.map((parent) => ({
    slug: parent.slug,
    name: parent.name,
    children: categories
      .filter((c) => c.parent_id === parent.category_id)
      .map((child) => ({
        slug: child.slug,
        name: child.name,
      })),
  }));
};