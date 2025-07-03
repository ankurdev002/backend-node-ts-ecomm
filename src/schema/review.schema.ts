import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    productId: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    comment: z
      .string()
      .min(10, "Comment must be at least 10 characters")
      .max(1000, "Comment must be at most 1000 characters")
      .optional(),
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be at most 100 characters")
      .optional(),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().regex(/^\d+$/, "Review ID must be a number"),
  }),
  body: z.object({
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5")
      .optional(),
    comment: z
      .string()
      .min(10, "Comment must be at least 10 characters")
      .max(1000, "Comment must be at most 1000 characters")
      .optional(),
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be at most 100 characters")
      .optional(),
  }),
});

export const getReviewsSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, "Product ID must be a number"),
  }),
  query: z.object({
    rating: z.string().regex(/^\d+$/, "Rating must be a number").optional(),
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    sortBy: z.enum(["rating", "createdAt", "helpful"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export const getUserReviewsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    sortBy: z.enum(["rating", "createdAt", "helpful"]).optional(),
    sortOrder: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export const deleteReviewSchema = z.object({
  params: z.object({
    reviewId: z.string().regex(/^\d+$/, "Review ID must be a number"),
  }),
});

export const reviewHelpfulSchema = z.object({
  params: z.object({
    reviewId: z.string().regex(/^\d+$/, "Review ID must be a number"),
  }),
  body: z.object({
    helpful: z.boolean(),
  }),
});

export const reviewReportSchema = z.object({
  params: z.object({
    reviewId: z.string().regex(/^\d+$/, "Review ID must be a number"),
  }),
  body: z.object({
    reason: z.enum(["inappropriate", "spam", "fake", "offensive", "other"]),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be at most 500 characters")
      .optional(),
  }),
});

export type CreateReviewDTO = z.infer<typeof createReviewSchema>;
export type UpdateReviewDTO = z.infer<typeof updateReviewSchema>;
export type GetReviewsDTO = z.infer<typeof getReviewsSchema>;
export type GetUserReviewsDTO = z.infer<typeof getUserReviewsSchema>;
export type DeleteReviewDTO = z.infer<typeof deleteReviewSchema>;
export type ReviewHelpfulDTO = z.infer<typeof reviewHelpfulSchema>;
export type ReviewReportDTO = z.infer<typeof reviewReportSchema>;
