import express from "express";
import {
  createProduct,
  getAllProductsByRolesAndId,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.controller";

const router = express.Router();

// Product Routes
router.post("/create", createProduct); // Create a new product
router.get("/all-list", getAllProducts); // Get all products for admin only
router.get("/all", getAllProductsByRolesAndId); // Get all products based on roles and id
router.get("/:id", getProductById); // Get a product by ID
router.put("/:id", updateProduct); // Update a product by ID
router.delete("/:id", deleteProduct); // Delete a product by ID

export default router;
