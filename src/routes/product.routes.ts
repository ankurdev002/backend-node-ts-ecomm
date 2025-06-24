import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsByRolesAndId,
  getProductById,
  updateProduct,
} from "../controllers/product.controller";
import paginate from "../middleware/pagination.middleware";
import { Product } from "../models/product.model";
import { validate } from "../middleware/validate.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../schema/product.schema";

const router = express.Router();

// Product Routes
router.post("/create", validate(createProductSchema), createProduct); // Create a new product
router.get("/all-list", paginate(Product), getAllProducts); // Get all products for admin only
router.get("/all", paginate(Product), getAllProductsByRolesAndId); // Get all products based on roles and id
router.get("/:id", getProductById); // Get a product by ID
router.put("/:id", validate(updateProductSchema), updateProduct); // Update a product by ID
router.delete("/:id", deleteProduct); // Delete a product by ID

export default router;
