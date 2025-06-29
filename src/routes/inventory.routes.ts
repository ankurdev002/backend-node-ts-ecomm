import { Router } from "express";
import {
  createProductInventory,
  updateProductInventory,
  getProductInventory,
  restockProduct,
  getLowStock,
  getOutOfStock,
  getInventoryReportData,
} from "../controllers/inventory.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All inventory routes require authentication
router.use(authenticateUser);

// @route POST /api/inventory/create
// @desc Create inventory for a product
// @access Admin/Vendor
router.post(
  ENDPOINTS.INVENTORY_ROUTE.CREATE_INVENTORY,
  authorizeRole(["admin", "vendor"]),
  createProductInventory
);

// @route GET /api/inventory/product/:productId
// @desc Get inventory for a specific product
// @access Admin/Vendor
router.get(
  ENDPOINTS.INVENTORY_ROUTE.GET_INVENTORY,
  authorizeRole(["admin", "vendor"]),
  getProductInventory
);

// @route PUT /api/inventory/product/:productId
// @desc Update inventory for a specific product
// @access Admin/Vendor
router.put(
  ENDPOINTS.INVENTORY_ROUTE.UPDATE_INVENTORY,
  authorizeRole(["admin", "vendor"]),
  updateProductInventory
);

// @route POST /api/inventory/restock/:productId
// @desc Restock a product
// @access Admin/Vendor
router.post(
  ENDPOINTS.INVENTORY_ROUTE.RESTOCK_INVENTORY,
  authorizeRole(["admin", "vendor"]),
  restockProduct
);

// @route GET /api/inventory/low-stock
// @desc Get low stock products
// @access Admin/Vendor
router.get(
  ENDPOINTS.INVENTORY_ROUTE.GET_LOW_STOCK,
  authorizeRole(["admin", "vendor"]),
  getLowStock
);

// @route GET /api/inventory/out-of-stock
// @desc Get out of stock products
// @access Admin/Vendor
router.get(
  ENDPOINTS.INVENTORY_ROUTE.GET_OUT_OF_STOCK,
  authorizeRole(["admin", "vendor"]),
  getOutOfStock
);

// @route GET /api/inventory/report
// @desc Get inventory report
// @access Admin/Vendor
router.get(
  ENDPOINTS.INVENTORY_ROUTE.GET_INVENTORY_REPORT,
  authorizeRole(["admin", "vendor"]),
  getInventoryReportData
);

export default router;
