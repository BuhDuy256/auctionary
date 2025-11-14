import * as categoryRepository from '../repositories/category.repository';

export const getAllCategories = async () => {
    return await categoryRepository.getAllCategories();
}