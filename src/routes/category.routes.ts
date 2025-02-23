import { Router } from "express";
import {
  createSuperCategory,
  getAllSuperCategories,
  getSuperCategoryById,
  updateSuperCategory,
  deleteSuperCategory,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  createProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} from "../controllers/category.controller";

const router = Router();

// SuperCategory Routes
router.post("/super-category", createSuperCategory);
router.get("/super-categories", getAllSuperCategories);
router.get("/super-category/:id", getSuperCategoryById);
router.put("/super-category/:id", updateSuperCategory);
router.delete("/super-category/:id", deleteSuperCategory);

// Category Routes
router.post("/category", createCategory);
router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

// SubCategory Routes
router.post("/sub-category", createSubCategory);
router.get("/sub-categories", getAllSubCategories);
router.get("/sub-category/:id", getSubCategoryById);
router.put("/sub-category/:id", updateSubCategory);
router.delete("/sub-category/:id", deleteSubCategory);

// productCategory Routes
router.post("/product-category", createProductCategory);
router.get("/product-categories", getAllProductCategories);
router.get("/product-category/:id", getProductCategoryById);
router.put("/product-category/:id", updateProductCategory);
router.delete("/product-category/:id", deleteProductCategory);

export default router;
