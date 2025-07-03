import { z } from "zod";

// Schema for adding item to wishlist
export const addToWishlistSchema = z.object({
  body: z.object({
    productId: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
  }),
});

// Schema for removing item from wishlist
export const removeFromWishlistSchema = z.object({
  params: z.object({
    wishlistItemId: z
      .string()
      .regex(/^\d+$/, "Wishlist item ID must be a number"),
  }),
});

// Schema for removing item by product ID
export const removeByProductIdSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, "Product ID must be a number"),
  }),
});

// Schema for checking if item is in wishlist
export const checkWishlistItemSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, "Product ID must be a number"),
  }),
});

// Schema for wishlist pagination
export const getWishlistSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    sortBy: z.enum(["createdAt", "productName", "price"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

// Schema for moving wishlist item to cart
export const moveToCartSchema = z.object({
  params: z.object({
    wishlistItemId: z
      .string()
      .regex(/^\d+$/, "Wishlist item ID must be a number"),
  }),
  body: z.object({
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .optional()
      .default(1),
  }),
});

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type RemoveFromWishlistInput = z.infer<typeof removeFromWishlistSchema>;
export type RemoveByProductIdInput = z.infer<typeof removeByProductIdSchema>;
export type CheckWishlistItemInput = z.infer<typeof checkWishlistItemSchema>;
export type GetWishlistInput = z.infer<typeof getWishlistSchema>;
export type MoveToCartInput = z.infer<typeof moveToCartSchema>;
