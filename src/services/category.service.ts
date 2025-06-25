import {
    Category,
    ProductCategory,
    SubCategory,
    SuperCategory,
} from "../models/category.model";

//SUPER CATEGORY SERVICE
export const createSuperCategory = async (data: any) =>
  SuperCategory.create(data);
export const getSuperCategoryById = async (id: string) =>
  SuperCategory.findOne({ where: { id, isActive: true } });
export const updateSuperCategory = async (id: string, data: any) => {
  const record = await SuperCategory.findByPk(id);
  if (!record) throw new Error("Super category not found");
  return await record.update(data);
};
export const softDeleteSuperCategory = async (id: string) => {
  const record = await SuperCategory.findByPk(id);
  if (!record) throw new Error("Super category not found");
  return await record.update({ isActive: false });
};

//CATEGORY SERVICE
export const createCategory = async (data: any) => Category.create(data);
export const getCategoryById = async (id: string) =>
  Category.findOne({ where: { id, isActive: true } });
export const updateCategory = async (id: string, data: any) => {
  const record = await Category.findByPk(id);
  if (!record) throw new Error("Category not found");
  return await record.update(data);
};
export const softDeleteCategory = async (id: string) => {
  const record = await Category.findByPk(id);
  if (!record) throw new Error("Category not found");
  return await record.update({ isActive: false });
};

// SUB CATEGORY SERVICE
export const createSubCategory = async (data: any) => SubCategory.create(data);
export const getSubCategoryById = async (id: string) =>
  SubCategory.findOne({ where: { id, isActive: true } });
export const updateSubCategory = async (id: string, data: any) => {
  const record = await SubCategory.findByPk(id);
  if (!record) throw new Error("Sub Category not found");
  return await record.update(data);
};
export const softDeleteSubCategory = async (id: string) => {
  const record = await SubCategory.findByPk(id);
  if (!record) throw new Error("Sub Category not found");
  return await record.update({ isActive: false });
};

// PRODUCT CATEGORY SERVICE
export const createProductCategory = async (data: any) =>
  ProductCategory.create(data);
export const getProductCategoryById = async (id: string) =>
  ProductCategory.findOne({ where: { id, isActive: true } });
export const updateProductCategory = async (id: string, data: any) => {
  const record = await ProductCategory.findByPk(id);
  if (!record) throw new Error("Product Category not found");
  return await record.update(data);
};
export const softDeleteProductCategory = async (id: string) => {
  const record = await ProductCategory.findByPk(id);
  if (!record) throw new Error("Product Category not found");
  return await record.update({ isActive: false });
};
