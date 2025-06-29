import { Router } from "express";
import {
  createCategory,
  createProductCategory,
  createSubCategory,
  createSuperCategory,
  deleteCategory,
  deleteProductCategory,
  deleteSubCategory,
  deleteSuperCategory,
  getAllCategories,
  getAllProductCategories,
  getAllSubCategories,
  getAllSuperCategories,
  getCategoryById,
  getProductCategoryById,
  getSubCategoryById,
  getSuperCategoryById,
  updateCategory,
  updateProductCategory,
  updateSubCategory,
  updateSuperCategory,
} from "../controllers/category.controller";
import paginate from "../middleware/pagination.middleware";
import {
  Category,
  ProductCategory,
  SubCategory,
  SuperCategory,
} from "../models/category.model";
import { validate } from "../middleware/validate.middleware";
import {
  createCategorySchema,
  createProductCategorySchema,
  createSubCategorySchema,
  createSuperCategorySchema,
  updateCategorySchema,
  updateProductCategorySchema,
  updateSubCategorySchema,
  updateSuperCategorySchema,
} from "../schema/category.schema";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// SuperCategory Routes
router.post(
 ENDPOINTS.ADMIN_ROUTE.SUPER_CATEGORY,
  validate(createSuperCategorySchema),
  createSuperCategory
);
router.get(ENDPOINTS.ADMIN_ROUTE.SUPER_CATEGORIES, paginate(SuperCategory), getAllSuperCategories);
router.get(ENDPOINTS.ADMIN_ROUTE.SUPER_CATEGORY_BY_ID, getSuperCategoryById);
router.put(
  ENDPOINTS.ADMIN_ROUTE.UPDATE_SUPER_CATEGORY,
  validate(updateSuperCategorySchema),
  updateSuperCategory
);
router.delete(ENDPOINTS.ADMIN_ROUTE.DELETE_SUPER_CATEGORY, deleteSuperCategory);

// Category Routes
router.post(ENDPOINTS.ADMIN_ROUTE.CATEGORY, validate(createCategorySchema), createCategory);
router.get(ENDPOINTS.ADMIN_ROUTE.CATEGORIES, paginate(Category), getAllCategories);
router.get(ENDPOINTS.ADMIN_ROUTE.CATEGORY_BY_ID, getCategoryById);
router.put(ENDPOINTS.ADMIN_ROUTE.UPDATE_CATEGORY, validate(updateCategorySchema), updateCategory);
router.delete(ENDPOINTS.ADMIN_ROUTE.DELETE_CATEGORY, deleteCategory);

// SubCategory Routes
router.post(
  ENDPOINTS.ADMIN_ROUTE.SUB_CATEGORY,
  validate(createSubCategorySchema),
  createSubCategory
);
router.get(ENDPOINTS.ADMIN_ROUTE.SUB_CATEGORIES, paginate(SubCategory), getAllSubCategories);
router.get(ENDPOINTS.ADMIN_ROUTE.SUB_CATEGORY_BY_ID, getSubCategoryById);
router.put(
  ENDPOINTS.ADMIN_ROUTE.UPDATE_SUB_CATEGORY,
  validate(updateSubCategorySchema),
  updateSubCategory
);
router.delete(ENDPOINTS.ADMIN_ROUTE.DELETE_SUB_CATEGORY, deleteSubCategory);

// productCategory Routes
router.post(
  ENDPOINTS.ADMIN_ROUTE.PRODUCT_CATEGORY,
  validate(createProductCategorySchema),
  createProductCategory
);
router.get(
  ENDPOINTS.ADMIN_ROUTE.PRODUCT_CATEGORIES,
  paginate(ProductCategory),
  getAllProductCategories
);
router.get(ENDPOINTS.ADMIN_ROUTE.PRODUCT_CATEGORY_BY_ID, getProductCategoryById);
router.put(
  ENDPOINTS.ADMIN_ROUTE.UPDATE_PRODUCT_CATEGORY,
  validate(updateProductCategorySchema),
  updateProductCategory
);
router.delete(ENDPOINTS.ADMIN_ROUTE.DELETE_PRODUCT_CATEGORY, deleteProductCategory);

export default router;
