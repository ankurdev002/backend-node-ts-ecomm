import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.number().int().positive("Product ID must be a positive integer"),
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
});

export const updateReviewSchema = z.object({
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
});

export const getReviewsSchema = z.object({
  productId: z.string().transform(Number).optional(),
  rating: z.string().transform(Number).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sortBy: z.enum(["rating", "createdAt", "helpful"]).optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
});

export const reviewHelpfulSchema = z.object({
  helpful: z.boolean(),
});

export const reviewReportSchema = z.object({
  reason: z.enum(["inappropriate", "spam", "fake", "offensive", "other"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),
});
