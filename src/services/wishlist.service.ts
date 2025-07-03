import Wishlist from "../models/wishlist.model";
import { Product } from "../models/product.model";
import Inventory from "../models/inventory.model";

export const addToWishlist = async (userId: number, productId: number) => {
  // Check if product exists and is active
  const product = await Product.findOne({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    throw new Error("Product not found or inactive");
  }

  // Check if item already exists in wishlist
  const existingWishlistItem = await Wishlist.findOne({
    where: { userId, productId },
  });

  if (existingWishlistItem) {
    throw new Error("Product is already in your wishlist");
  }

  // Create new wishlist item
  const wishlistItem = await Wishlist.create({
    userId,
    productId,
  });

  // Return wishlist item with product data
  const wishlistItemWithProduct = {
    ...wishlistItem.toJSON(),
    product: product.toJSON(),
  };

  return wishlistItemWithProduct;
};

export const removeFromWishlist = async (
  userId: number,
  wishlistItemId: number
) => {
  const wishlistItem = await Wishlist.findOne({
    where: { id: wishlistItemId, userId },
  });

  if (!wishlistItem) {
    throw new Error("Wishlist item not found");
  }

  await wishlistItem.destroy();
  return { message: "Item removed from wishlist successfully" };
};

export const removeFromWishlistByProductId = async (
  userId: number,
  productId: number
) => {
  const wishlistItem = await Wishlist.findOne({
    where: { userId, productId },
  });

  if (!wishlistItem) {
    throw new Error("Product not found in wishlist");
  }

  await wishlistItem.destroy();
  return { message: "Product removed from wishlist successfully" };
};

export const getUserWishlist = async (
  userId: number,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;

  // Get wishlist items without include to avoid association issues
  const { rows: wishlistItems, count: totalItems } =
    await Wishlist.findAndCountAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

  // Get products and inventory separately for each wishlist item
  const wishlistItemsWithProducts = [];

  for (const wishlistItem of wishlistItems) {
    const product = await Product.findByPk(wishlistItem.productId);
    const inventory = await Inventory.findOne({
      where: { productId: wishlistItem.productId },
    });

    if (product) {
      const wishlistItemWithProduct = {
        ...wishlistItem.toJSON(),
        product: {
          ...product.toJSON(),
          inventory: inventory ? inventory.toJSON() : null,
        },
      };
      wishlistItemsWithProducts.push(wishlistItemWithProduct);
    }
  }

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: wishlistItemsWithProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const checkIfInWishlist = async (userId: number, productId: number) => {
  const wishlistItem = await Wishlist.findOne({
    where: { userId, productId },
  });

  return {
    inWishlist: !!wishlistItem,
    wishlistItemId: wishlistItem?.id || null,
  };
};

export const getWishlistCount = async (userId: number) => {
  const count = await Wishlist.count({
    where: { userId },
  });

  return { count };
};

export const clearWishlist = async (userId: number) => {
  await Wishlist.destroy({ where: { userId } });
  return { message: "Wishlist cleared successfully" };
};

export const moveWishlistItemToCart = async (
  userId: number,
  wishlistItemId: number
) => {
  const wishlistItem = await Wishlist.findOne({
    where: { id: wishlistItemId, userId },
  });

  if (!wishlistItem) {
    throw new Error("Wishlist item not found");
  }

  // Check if product is still available
  const product = await Product.findOne({
    where: { id: wishlistItem.productId, isActive: true },
  });

  if (!product) {
    throw new Error("Product is no longer available");
  }

  // Check inventory
  const inventory = await Inventory.findOne({
    where: { productId: wishlistItem.productId },
  });

  if (!inventory || inventory.availableQuantity < 1) {
    throw new Error("Product is out of stock");
  }

  // Remove from wishlist
  await wishlistItem.destroy();

  return {
    message: "Item removed from wishlist. You can now add it to your cart.",
    productId: wishlistItem.productId,
  };
};
