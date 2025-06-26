import { z } from "zod";

// Schema for adding item to cart
export const addToCartSchema = z.object({
  body: z.object({
    productId: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    selectedVariant: z.record(z.any()).optional(),
  }),
});

// Schema for updating cart item quantity
export const updateCartItemSchema = z.object({
  params: z.object({
    cartItemId: z.string().regex(/^\d+$/, "Cart item ID must be a number"),
  }),
  body: z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  }),
});

// Schema for removing cart item
export const removeCartItemSchema = z.object({
  params: z.object({
    cartItemId: z.string().regex(/^\d+$/, "Cart item ID must be a number"),
  }),
});

// Schema for cart validation query parameters
export const cartValidationSchema = z.object({
  query: z.object({
    checkStock: z.string().optional(),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
