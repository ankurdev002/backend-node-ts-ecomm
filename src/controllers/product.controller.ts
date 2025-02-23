import { Request, Response } from "express";
import {
  Category,
  Product,
  ProductCategory,
  SubCategory,
  SuperCategory,
} from "../models/product.model";

// Create Product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, ...productData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const product = await Product.create({ userId, ...productData });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get All Active and InActive Product List For Admin only
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get All Products with Category Names based on the id
export const getAllProductsByRolesAndId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.query;

    const products = await Product.findAll({
      where: { userId: Number(userId) },
      include: [
        {
          model: SuperCategory,
          as: "superCategory",
          attributes: ["id", "name", "isActive"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "isActive"],
        },
        {
          model: SubCategory,
          as: "subCategory",
          attributes: ["id", "name", "isActive"],
        },
        {
          model: ProductCategory,
          as: "productCategory",
          attributes: ["id", "name", "isActive"],
        },
      ],
    });
    res.status(200).json(products);
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
    const product = await Product.findOne({
      where: { id: req.params.id, isActive: true, userId: Number(userId) }, // Ensure only active products are fetched
      include: [
        {
          model: SuperCategory,
          as: "superCategory",
          attributes: ["id", "name", "isActive"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "isActive"],
        },
        {
          model: SubCategory,
          as: "subCategory",
          attributes: ["id", "name", "isActive"],
        },
        {
          model: ProductCategory,
          as: "productCategory",
          attributes: ["id", "name", "isActive"],
        },
      ],
    });

    if (!product)
      return res
        .status(404)
        .json({ error: "Product not found or not authorized" });

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
    const { userId } = req.body;
    const product = await Product.findOne({
      where: { id: req.params.id, userId },
    });

    if (!product)
      return res.status(404).json({
        error: "Product not found or not authorized for updating the product",
      });

    await product.update(req.body);
    res.status(200).json(product);
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
    const product = await Product.findOne({
      where: { id: req.params.id, userId: Number(userId) },
    });

    if (!product)
      return res.status(404).json({
        error: "Product not found or not authorized for deleting the product",
      });

    await product.update({ isActive: false }); // Soft delete by marking inactive
    // await product.destroy(); // for hard delete the product
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
