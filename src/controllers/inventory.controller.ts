import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import {
  createInventory,
  updateInventory,
  getInventoryByProduct,
  restockInventory,
  getLowStockProducts,
  getOutOfStockProducts,
  getInventoryReport,
} from "../services/inventory.service";

export const createProductInventory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId, sku, quantity, reorderLevel } = req.body;

    const inventory = await createInventory({
      productId,
      sku,
      quantity,
      reorderLevel,
    });

    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: inventory,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProductInventory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const inventory = await updateInventory(parseInt(productId), updateData);

    res.json({
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductInventory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;

    const inventory = await getInventoryByProduct(parseInt(productId));

    res.json({
      success: true,
      message: "Inventory retrieved successfully",
      data: inventory,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const restockProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const inventory = await restockInventory(parseInt(productId), quantity);

    res.json({
      success: true,
      message: "Product restocked successfully",
      data: inventory,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLowStock = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const vendorId = req.user?.userType === "vendor" ? req.user.id : undefined;

    const lowStockProducts = await getLowStockProducts(vendorId);

    res.json({
      success: true,
      message: "Low stock products retrieved successfully",
      data: lowStockProducts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOutOfStock = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const vendorId = req.user?.userType === "vendor" ? req.user.id : undefined;

    const outOfStockProducts = await getOutOfStockProducts(vendorId);

    res.json({
      success: true,
      message: "Out of stock products retrieved successfully",
      data: outOfStockProducts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInventoryReportData = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const vendorId = req.user?.userType === "vendor" ? req.user.id : undefined;

    const report = await getInventoryReport(vendorId);

    res.json({
      success: true,
      message: "Inventory report generated successfully",
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
