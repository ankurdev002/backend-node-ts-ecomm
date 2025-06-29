import Cart from "../models/cart.model";
import { Product } from "../models/product.model";
import Inventory from "../models/inventory.model";

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number,
  selectedVariant?: Record<string, any>
) => {
  // Check if product exists and is active - without include
  const product = await Product.findOne({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    throw new Error("Product not found or inactive");
  }

  // Get inventory separately to avoid association issues
  const inventory = await Inventory.findOne({
    where: { productId },
  });

  // Check if inventory exists for this product
  if (!inventory) {
    throw new Error("Inventory is not associated to product!");
  }

  // Check inventory
  if (inventory.availableQuantity < quantity) {
    throw new Error("Insufficient stock");
  }

  // Get the current price from product pricing
  const currentPrice = product.pricing[0]?.finalPrice || 0;

  // Check if item already exists in cart
  const whereClause: any = {
    userId,
    productId,
  };

  if (selectedVariant) {
    whereClause.selectedVariant = selectedVariant;
  } else {
    whereClause.selectedVariant = null;
  }

  const existingCartItem = await Cart.findOne({
    where: whereClause,
  });

  if (existingCartItem) {
    // Update quantity
    const newQuantity = existingCartItem.quantity + quantity;

    // Check stock again for new quantity
    if (inventory.availableQuantity < newQuantity) {
      throw new Error("Insufficient stock for requested quantity");
    }

    existingCartItem.quantity = newQuantity;
    existingCartItem.price = currentPrice;
    await existingCartItem.save();
    return existingCartItem;
  } else {
    // Create new cart item
    return await Cart.create({
      userId,
      productId,
      quantity,
      selectedVariant,
      price: currentPrice,
    });
  }
};

export const removeFromCart = async (userId: number, cartItemId: number) => {
  const cartItem = await Cart.findOne({
    where: { id: cartItemId, userId },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await cartItem.destroy();
  return { message: "Item removed from cart" };
};

export const updateCartItem = async (
  userId: number,
  cartItemId: number,
  quantity: number
) => {
  // Get cart item without include to avoid association issues
  const cartItem = await Cart.findOne({
    where: { id: cartItemId, userId },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Get product and inventory separately
  const product = await Product.findByPk(cartItem.productId);
  const inventory = await Inventory.findOne({
    where: { productId: cartItem.productId },
  });

  // Check inventory
  if (inventory && inventory.availableQuantity < quantity) {
    throw new Error("Insufficient stock");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  // Return cart item with product data manually attached
  const cartItemWithProduct = {
    ...cartItem.toJSON(),
    product: product
      ? {
          ...product.toJSON(),
          inventory: inventory ? inventory.toJSON() : null,
        }
      : null,
  };

  return cartItemWithProduct;
};

export const getCartItems = async (userId: number) => {
  // Get cart items without include to avoid association issues
  const cartItems = await Cart.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  // Get products and inventory separately for each cart item
  const cartItemsWithProducts = [];
  let totalItems = 0;
  let totalAmount = 0;

  for (const cartItem of cartItems) {
    const product = await Product.findByPk(cartItem.productId);
    const inventory = await Inventory.findOne({
      where: { productId: cartItem.productId },
    });

    const cartItemWithProduct = {
      ...cartItem.toJSON(),
      product: product
        ? {
            ...product.toJSON(),
            inventory: inventory ? inventory.toJSON() : null,
          }
        : null,
    };

    cartItemsWithProducts.push(cartItemWithProduct);
    totalItems += cartItem.quantity;
    totalAmount += cartItem.quantity * cartItem.price;
  }

  return {
    items: cartItemsWithProducts,
    summary: {
      totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      itemCount: cartItemsWithProducts.length,
    },
  };
};

export const clearCart = async (userId: number) => {
  await Cart.destroy({ where: { userId } });
  return { message: "Cart cleared successfully" };
};

export const validateCartStock = async (userId: number) => {
  // Get cart items without include to avoid association issues
  const cartItems = await Cart.findAll({
    where: { userId },
  });

  const stockIssues = [];

  for (const item of cartItems) {
    // Get product and inventory separately
    const product = await Product.findByPk(item.productId);
    const inventory = await Inventory.findOne({
      where: { productId: item.productId },
    });

    if (!product || !product.isActive) {
      stockIssues.push({
        cartItemId: item.id,
        productId: item.productId,
        issue: "Product is no longer available",
      });
    } else if (inventory && inventory.availableQuantity < item.quantity) {
      stockIssues.push({
        cartItemId: item.id,
        productId: item.productId,
        issue: `Only ${inventory.availableQuantity} items available`,
        availableQuantity: inventory.availableQuantity,
      });
    }
  }

  return stockIssues;
};
