// utils/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({ errors: result.error.errors });
      return;
    }

    req.body = result.data; // overwrite with parsed + typed data
    next();
  };
