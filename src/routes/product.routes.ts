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
import { ENDPOINTS } from "../constants/endpoint";

const router = express.Router();

// Product Routes
router.post(
  ENDPOINTS.ADMIN_ROUTE.CREATE_PRODUCT,
  validate(createProductSchema),
  createProduct
); // Create a new product
router.get(
  ENDPOINTS.ADMIN_ROUTE.ALL_PRODUCTS,
  paginate(Product),
  getAllProducts
); // Get all products for admin only
router.get(
  ENDPOINTS.ADMIN_ROUTE.PRODUCT_BY_ID_AND_ROLES,
  paginate(Product),
  getAllProductsByRolesAndId
); // Get all products based on roles and id
router.get(ENDPOINTS.ADMIN_ROUTE.PRODUCT_BY_ID, getProductById); // Get a product by ID
router.put(
  ENDPOINTS.ADMIN_ROUTE.UPDATE_PRODUCT,
  validate(updateProductSchema),
  updateProduct
); // Update a product by ID
router.delete(ENDPOINTS.ADMIN_ROUTE.DELETE_PRODUCT, deleteProduct); // Delete a product by ID

export default router;
