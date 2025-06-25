import { Request, Response } from "express";
import { ProductCategory } from "../models/category.model";
import * as categoryService from "../services/category.service";
import { PaginatedRequest } from "../types/common.type";

// SuperCategory CRUD
export const createSuperCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.createSuperCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create super category" });
  }
};

export const getAllSuperCategories = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch super categories" });
  }
};

export const getSuperCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.getSuperCategoryById(req.params.id);
    if (!result)
      return res.status(404).json({ error: "Super category not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch super category" });
  }
};

export const updateSuperCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.updateSuperCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update super category" });
  }
};

export const deleteSuperCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    await categoryService.softDeleteSuperCategory(req.params.id);
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
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getAllCategories = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.getCategoryById(req.params.id);
    if (!result) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    await categoryService.softDeleteCategory(req.params.id);
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
    const result = await categoryService.createSubCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sub category" });
  }
};

export const getAllSubCategories = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub categories" });
  }
};

export const getSubCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.getSubCategoryById(req.params.id);
    if (!result)
      return res.status(404).json({ error: "Sub Category not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sub category" });
  }
};

export const updateSubCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.updateSubCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sub category" });
  }
};

export const deleteSubCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    await categoryService.softDeleteSubCategory(req.params.id);
    res.status(200).json({ message: "Sub Category deleted" });
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
    const result = await categoryService.createProductCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product category" });
  }
};

export const getAllProductCategories = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product categories" });
  }
};

export const getProductCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.getProductCategoryById(req.params.id);
    if (!result)
      return res.status(404).json({ error: "Product category not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product category" });
  }
};

export const updateProductCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await categoryService.updateProductCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product category" });
  }
};

export const deleteProductCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    await categoryService.softDeleteProductCategory(req.params.id);
    res.status(200).json({ message: "Product category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product category" });
  }
};
