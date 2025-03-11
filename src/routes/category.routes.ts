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
} from "../models/product.model";

const router = Router();

// SuperCategory Routes
router.post("/super-category", createSuperCategory);
router.get("/super-categories", paginate(SuperCategory), getAllSuperCategories);
router.get("/super-category/:id", getSuperCategoryById);
router.put("/super-category/:id", updateSuperCategory);
router.delete("/super-category/:id", deleteSuperCategory);

// Category Routes
router.post("/category", createCategory);
router.get("/categories", paginate(Category), getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

// SubCategory Routes
router.post("/sub-category", createSubCategory);
router.get("/sub-categories", paginate(SubCategory), getAllSubCategories);
router.get("/sub-category/:id", getSubCategoryById);
router.put("/sub-category/:id", updateSubCategory);
router.delete("/sub-category/:id", deleteSubCategory);

// productCategory Routes
router.post("/product-category", createProductCategory);
router.get(
  "/product-categories",
  paginate(ProductCategory),
  getAllProductCategories
);
router.get("/product-category/:id", getProductCategoryById);
router.put("/product-category/:id", updateProductCategory);
router.delete("/product-category/:id", deleteProductCategory);

export default router;
