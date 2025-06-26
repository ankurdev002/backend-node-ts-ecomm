import Inventory from "../models/inventory.model";
import { Product } from "../models/product.model";
import Notification from "../models/notification.model";
import { Op } from "sequelize";

interface CreateInventoryData {
  productId: number;
  sku: string;
  quantity: number;
  reorderLevel?: number;
}

export const createInventory = async (inventoryData: CreateInventoryData) => {
  const { productId, sku, quantity, reorderLevel = 10 } = inventoryData;

  // Check if product exists
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Check if inventory already exists for this product
  const existingInventory = await Inventory.findOne({
    where: { productId },
  });

  if (existingInventory) {
    throw new Error("Inventory already exists for this product");
  }

  const inventory = await Inventory.create({
    productId,
    sku,
    quantity,
    reorderLevel,
    lastRestocked: new Date(),
  });

  return inventory;
};

export const updateInventory = async (
  productId: number,
  updateData: Partial<CreateInventoryData>
) => {
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  await inventory.update(updateData);
  return inventory;
};

export const restockInventory = async (
  productId: number,
  additionalQuantity: number
) => {
  const inventory = await Inventory.findOne({
    where: { productId },
    include: [{ model: Product, as: "product" }],
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  inventory.quantity += additionalQuantity;
  inventory.lastRestocked = new Date();
  await inventory.save();

  // Create notification for vendor if stock was low
  if (inventory.product && inventory.product.userId) {
    await Notification.create({
      userId: inventory.product.userId,
      title: "Inventory Restocked",
      message: `${additionalQuantity} units added to ${inventory.product.name}. Current stock: ${inventory.quantity}`,
      type: "info",
      relatedId: productId,
      relatedType: "product",
    });
  }

  return inventory;
};

export const getLowStockProducts = async (vendorId?: number) => {
  const whereClause: any = {
    quantity: {
      [Op.lte]: Inventory.sequelize?.col("reorderLevel"),
    },
  };

  const includeClause: any = {
    model: Product,
    as: "product",
    where: { isActive: true },
  };

  if (vendorId) {
    includeClause.where.userId = vendorId;
  }

  const lowStockItems = await Inventory.findAll({
    where: whereClause,
    include: [includeClause],
    order: [["quantity", "ASC"]],
  });

  return lowStockItems;
};

export const getOutOfStockProducts = async (vendorId?: number) => {
  const whereClause: any = {
    quantity: 0,
  };

  const includeClause: any = {
    model: Product,
    as: "product",
    where: { isActive: true },
  };

  if (vendorId) {
    includeClause.where.userId = vendorId;
  }

  const outOfStockItems = await Inventory.findAll({
    where: whereClause,
    include: [includeClause],
  });

  return outOfStockItems;
};

export const getInventoryByProduct = async (productId: number) => {
  const inventory = await Inventory.findOne({
    where: { productId },
    include: [{ model: Product, as: "product" }],
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  return inventory;
};

export const checkStock = async (
  productId: number,
  requestedQuantity: number
) => {
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  if (!inventory) {
    return {
      available: false,
      message: "Product not found in inventory",
    };
  }

  const availableQuantity = inventory.availableQuantity;

  return {
    available: availableQuantity >= requestedQuantity,
    availableQuantity,
    requestedQuantity,
    message:
      availableQuantity >= requestedQuantity
        ? "Stock available"
        : `Only ${availableQuantity} units available`,
  };
};

export const reserveStock = async (productId: number, quantity: number) => {
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  const success = await inventory.reserveStock(quantity);
  if (!success) {
    throw new Error("Insufficient stock to reserve");
  }

  return inventory;
};

export const releaseStock = async (productId: number, quantity: number) => {
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  await inventory.releaseStock(quantity);
  return inventory;
};

export const fulfillOrder = async (productId: number, quantity: number) => {
  const inventory = await Inventory.findOne({
    where: { productId },
    include: [{ model: Product, as: "product" }],
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  const success = await inventory.fulfillOrder(quantity);
  if (!success) {
    throw new Error("Cannot fulfill order - insufficient stock");
  }

  // Check if stock is now low and notify vendor
  if (inventory.isLowStock && inventory.product && inventory.product.userId) {
    await Notification.create({
      userId: inventory.product.userId,
      title: "Low Stock Alert",
      message: `${inventory.product.name} is running low on stock. Current quantity: ${inventory.quantity}`,
      type: "warning",
      relatedId: productId,
      relatedType: "product",
    });
  }

  return inventory;
};

export const getInventoryReport = async (vendorId?: number) => {
  const includeClause: any = {
    model: Product,
    as: "product",
    where: { isActive: true },
  };

  if (vendorId) {
    includeClause.where.userId = vendorId;
  }

  const allInventory = await Inventory.findAll({
    include: [includeClause],
  });

  const totalProducts = allInventory.length;
  const lowStockCount = allInventory.filter((inv) => inv.isLowStock).length;
  const outOfStockCount = allInventory.filter((inv) => inv.isOutOfStock).length;
  const totalValue = allInventory.reduce((sum, inv) => {
    const price = inv.product.pricing[0]?.finalPrice || 0;
    return sum + inv.quantity * price;
  }, 0);

  return {
    summary: {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalValue: Math.round(totalValue * 100) / 100,
    },
    lowStockProducts: allInventory.filter((inv) => inv.isLowStock),
    outOfStockProducts: allInventory.filter((inv) => inv.isOutOfStock),
  };
};
