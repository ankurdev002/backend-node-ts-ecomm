import { Request, Response } from "express";
import {
  SuperCategory,
  Category,
  SubCategory,
  ProductCategory,
} from "../models/product.model";

// SuperCategory CRUD
export const createSuperCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const superCategory = await SuperCategory.create(req.body);
    res.status(201).json(superCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create super category" });
  }
};

export const getAllSuperCategories = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const superCategories = await SuperCategory.findAll({
      where: { isActive: true },
    });
    res.status(200).json(superCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch super categories" });
  }
};

export const getSuperCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const superCategory = await SuperCategory.findOne({
      where: {
        id: req.params.id,
        isActive: true,
      },
    });
    if (!superCategory)
      return res.status(404).json({ error: "Super category not found" });
    res.status(200).json(superCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch super category" });
  }
};

export const updateSuperCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const superCategory = await SuperCategory.findByPk(req.params.id);
    if (!superCategory)
      return res.status(404).json({ error: "Super category not found" });

    await superCategory.update(req.body);
    res.status(200).json(superCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update super category" });
  }
};

export const deleteSuperCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const superCategory = await SuperCategory.findByPk(req.params.id);
    if (!superCategory)
      return res.status(404).json({ error: "Super category not found" });

    await superCategory.update({ isActive: false }); // Soft delete
    // await superCategory.destroy();
    res.status(200).json({ message: "Super category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete super category" });
  }
};

// Category CRUD
export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getAllCategories = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, isActive: true },
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.update(req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.update({ isActive: false }); // Soft delete
    // await category.destroy();
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// SubCategory CRUD
export const createSubCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sub category" });
  }
};

export const getAllSubCategories = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const subCategories = await SubCategory.findAll({
      where: { isActive: true },
    });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub categories" });
  }
};

export const getSubCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const subCategory = await SubCategory.findOne({
      where: { id: req.params.id, isActive: true },
    });
    if (!subCategory)
      return res.status(404).json({ error: "Sub category not found" });
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub category" });
  }
};

export const updateSubCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory)
      return res.status(404).json({ error: "Sub category not found" });

    await subCategory.update(req.body);
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sub category" });
  }
};

export const deleteSubCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory)
      return res.status(404).json({ error: "Sub category not found" });

    await subCategory.update({ isActive: false }); // Soft delete
    // await subCategory.destroy();
    res.status(200).json({ message: "Sub category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sub category" });
  }
};

// ProductCategory CRUD
export const createProductCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const productCategory = await ProductCategory.create(req.body);
    res.status(201).json(productCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product category" });
  }
};

export const getAllProductCategories = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const productCategories = await ProductCategory.findAll({
      where: { isActive: true },
    });
    res.status(200).json(productCategories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product categories" });
  }
};

export const getProductCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.id);
    if (!productCategory)
      return res.status(404).json({ error: "Product category not found" });
    res.status(200).json(productCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product category" });
  }
};

export const updateProductCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const productCategory = await ProductCategory.findOne({
      where: { id: req.params.id, isActive: true },
    });
    if (!productCategory)
      return res.status(404).json({ error: "product category not found" });

    await productCategory.update(req.body);
    res.status(200).json(productCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product category" });
  }
};

export const deleteProductCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const productCategory = await ProductCategory.findByPk(req.params.id);
    if (!productCategory)
      return res.status(404).json({ error: "product category not found" });

    await productCategory.update({ isActive: false }); // Soft delete
    // await productCategory.destroy();
    res.status(200).json({ message: "Product category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product category" });
  }
};
