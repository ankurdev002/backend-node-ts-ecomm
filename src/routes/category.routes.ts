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

const router = Router();

// SuperCategory Routes
router.post(
  "/super-category",
  validate(createSuperCategorySchema),
  createSuperCategory
);
router.get("/super-categories", paginate(SuperCategory), getAllSuperCategories);
router.get("/super-category/:id", getSuperCategoryById);
router.put(
  "/super-category/:id",
  validate(updateSuperCategorySchema),
  updateSuperCategory
);
router.delete("/super-category/:id", deleteSuperCategory);

// Category Routes
router.post("/category", validate(createCategorySchema), createCategory);
router.get("/categories", paginate(Category), getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", validate(updateCategorySchema), updateCategory);
router.delete("/category/:id", deleteCategory);

// SubCategory Routes
router.post(
  "/sub-category",
  validate(createSubCategorySchema),
  createSubCategory
);
router.get("/sub-categories", paginate(SubCategory), getAllSubCategories);
router.get("/sub-category/:id", getSubCategoryById);
router.put(
  "/sub-category/:id",
  validate(updateSubCategorySchema),
  updateSubCategory
);
router.delete("/sub-category/:id", deleteSubCategory);

// productCategory Routes
router.post(
  "/product-category",
  validate(createProductCategorySchema),
  createProductCategory
);
router.get(
  "/product-categories",
  paginate(ProductCategory),
  getAllProductCategories
);
router.get("/product-category/:id", getProductCategoryById);
router.put(
  "/product-category/:id",
  validate(updateProductCategorySchema),
  updateProductCategory
);
router.delete("/product-category/:id", deleteProductCategory);

export default router;
