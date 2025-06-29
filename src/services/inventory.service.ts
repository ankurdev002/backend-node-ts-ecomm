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
  // Get inventory without include to avoid association issues
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  inventory.quantity += additionalQuantity;
  inventory.lastRestocked = new Date();
  await inventory.save();

  // Get product separately for notification
  const product = await Product.findByPk(productId);

  // Create notification for vendor if stock was low and product exists
  if (product && product.userId) {
    await Notification.create({
      userId: product.userId,
      title: "Inventory Restocked",
      message: `${additionalQuantity} units added to ${product.name}. Current stock: ${inventory.quantity}`,
      type: "info",
      relatedId: productId,
      relatedType: "product",
    });
  }

  // Return inventory with product data manually attached
  const inventoryWithProduct = {
    ...inventory.toJSON(),
    product: product ? product.toJSON() : null,
  };

  return inventoryWithProduct;
};

export const getLowStockProducts = async (vendorId?: number) => {
  // Get low stock inventory items without include
  const lowStockItems = await Inventory.findAll({
    where: {
      quantity: {
        [Op.lte]: Inventory.sequelize?.col("reorderLevel"),
      },
    },
    order: [["quantity", "ASC"]],
  });

  // Get products separately and filter by vendor if needed
  const inventoryWithProducts = [];

  for (const inventory of lowStockItems) {
    const product = await Product.findOne({
      where: {
        id: inventory.productId,
        isActive: true,
        ...(vendorId && { userId: vendorId }),
      },
    });

    if (product) {
      inventoryWithProducts.push({
        ...inventory.toJSON(),
        product: product.toJSON(),
      });
    }
  }

  return inventoryWithProducts;
};

export const getOutOfStockProducts = async (vendorId?: number) => {
  // Get out of stock inventory items without include
  const outOfStockItems = await Inventory.findAll({
    where: {
      quantity: 0,
    },
  });

  // Get products separately and filter by vendor if needed
  const inventoryWithProducts = [];

  for (const inventory of outOfStockItems) {
    const product = await Product.findOne({
      where: {
        id: inventory.productId,
        isActive: true,
        ...(vendorId && { userId: vendorId }),
      },
    });

    if (product) {
      inventoryWithProducts.push({
        ...inventory.toJSON(),
        product: product.toJSON(),
      });
    }
  }

  return inventoryWithProducts;
};

export const getInventoryByProduct = async (productId: number) => {
  try {
    // Get inventory without include first
    const inventory = await Inventory.findOne({
      where: { productId },
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    // Get product separately to avoid association issues
    const product = await Product.findByPk(productId);

    // Manually attach product data to inventory
    const inventoryWithProduct = {
      ...inventory.toJSON(),
      product: product ? product.toJSON() : null,
    };

    return inventoryWithProduct;
  } catch (error: any) {
    console.error("Database query error:", error);
    throw new Error(`Failed to fetch inventory: ${error.message}`);
  }
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
  // Get inventory without include to avoid association issues
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory not found");
  }

  const success = await inventory.fulfillOrder(quantity);
  if (!success) {
    throw new Error("Cannot fulfill order - insufficient stock");
  }

  // Get product separately for notification
  const product = await Product.findByPk(productId);

  // Check if stock is now low and notify vendor
  if (inventory.isLowStock && product && product.userId) {
    await Notification.create({
      userId: product.userId,
      title: "Low Stock Alert",
      message: `${product.name} is running low on stock. Current quantity: ${inventory.quantity}`,
      type: "warning",
      relatedId: productId,
      relatedType: "product",
    });
  }

  // Return inventory with product data manually attached
  const inventoryWithProduct = {
    ...inventory.toJSON(),
    product: product ? product.toJSON() : null,
  };

  return inventoryWithProduct;
};

export const getInventoryReport = async (vendorId?: number) => {
  // Get all inventory items without include
  const allInventory = await Inventory.findAll({});

  // Get products separately and filter by vendor if needed
  const inventoryWithProducts = [];

  for (const inventory of allInventory) {
    const product = await Product.findOne({
      where: {
        id: inventory.productId,
        isActive: true,
        ...(vendorId && { userId: vendorId }),
      },
    });

    if (product) {
      inventoryWithProducts.push({
        ...inventory.toJSON(),
        product: product.toJSON(),
        isLowStock: inventory.isLowStock,
        isOutOfStock: inventory.isOutOfStock,
      });
    }
  }

  const totalProducts = inventoryWithProducts.length;
  const lowStockCount = inventoryWithProducts.filter(
    (inv) => inv.isLowStock
  ).length;
  const outOfStockCount = inventoryWithProducts.filter(
    (inv) => inv.isOutOfStock
  ).length;
  const totalValue = inventoryWithProducts.reduce((sum, inv) => {
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
    lowStockProducts: inventoryWithProducts.filter((inv) => inv.isLowStock),
    outOfStockProducts: inventoryWithProducts.filter((inv) => inv.isOutOfStock),
  };
};
