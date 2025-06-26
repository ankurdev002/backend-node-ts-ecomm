import Cart from "../models/cart.model";
import { Product } from "../models/product.model";
import Inventory from "../models/inventory.model";

export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number,
  selectedVariant?: Record<string, any>
) => {
  // Check if product exists and is active
  const product = await Product.findOne({
    where: { id: productId, isActive: true },
    include: [{ model: Inventory, as: "inventory" }],
  });

  if (!product) {
    throw new Error("Product not found or inactive");
  }

  // Check inventory
  if (product.inventory && product.inventory.availableQuantity < quantity) {
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
    if (
      product.inventory &&
      product.inventory.availableQuantity < newQuantity
    ) {
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
  const cartItem = await Cart.findOne({
    where: { id: cartItemId, userId },
    include: [
      {
        model: Product,
        as: "product",
        include: [{ model: Inventory, as: "inventory" }],
      },
    ],
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Check inventory
  if (
    cartItem.product.inventory &&
    cartItem.product.inventory.availableQuantity < quantity
  ) {
    throw new Error("Insufficient stock");
  }

  cartItem.quantity = quantity;
  await cartItem.save();
  return cartItem;
};

export const getCartItems = async (userId: number) => {
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
        include: [{ model: Inventory, as: "inventory" }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Calculate cart totals
  let totalItems = 0;
  let totalAmount = 0;

  cartItems.forEach((item) => {
    totalItems += item.quantity;
    totalAmount += item.quantity * item.price;
  });

  return {
    items: cartItems,
    summary: {
      totalItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      itemCount: cartItems.length,
    },
  };
};

export const clearCart = async (userId: number) => {
  await Cart.destroy({ where: { userId } });
  return { message: "Cart cleared successfully" };
};

export const validateCartStock = async (userId: number) => {
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
        include: [{ model: Inventory, as: "inventory" }],
      },
    ],
  });

  const stockIssues = [];

  for (const item of cartItems) {
    if (!item.product.isActive) {
      stockIssues.push({
        cartItemId: item.id,
        productId: item.productId,
        issue: "Product is no longer available",
      });
    } else if (
      item.product.inventory &&
      item.product.inventory.availableQuantity < item.quantity
    ) {
      stockIssues.push({
        cartItemId: item.id,
        productId: item.productId,
        issue: `Only ${item.product.inventory.availableQuantity} items available`,
        availableQuantity: item.product.inventory.availableQuantity,
      });
    }
  }

  return stockIssues;
};
