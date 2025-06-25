import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { PaginatedRequest } from "../types/common.type";

// Create Product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, ...data } = req.body;
    const result = await productService.createProduct(userId, data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get All Active and InActive Product List For Admin only
export const getAllProducts = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get All Products with Category Names based on the id
export const getAllProductsByRolesAndId = async (
  req: PaginatedRequest,
  res: Response
): Promise<any> => {
  try {
    res.status(200).json(req.paginatedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get Product by ID with Category Names
export const getProductById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const product = await productService.getProductByIdWithRole(
      req.params.id,
      Number(userId)
    );

    if (!product)
      return res
        .status(404)
        .json({ error: "Product not found or unauthorized" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Update Product
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, ...data } = req.body;
    const result = await productService.updateProduct(
      req.params.id,
      userId,
      data
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete Product
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;
    await productService.deleteProduct(req.params.id, Number(userId));
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
