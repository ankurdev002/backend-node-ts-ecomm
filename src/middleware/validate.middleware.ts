// utils/validate.ts
import { ZodSchema, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Test if this is a wrapped schema by trying to parse a sample wrapped object
      let isWrappedSchema = false;

      try {
        const testResult = schema.safeParse({
          body: {},
          params: {},
          query: {},
        });
        // If the schema accepts this structure or gives specific errors about body/params/query,
        // it's likely a wrapped schema
        if (
          testResult.success ||
          (testResult.error &&
            testResult.error.errors.some((err) =>
              ["body", "params", "query"].includes(err.path[0] as string)
            ))
        ) {
          isWrappedSchema = true;
        }
      } catch (e) {
        // If testing fails, fallback to inspection method
        if (schema instanceof ZodObject) {
          try {
            const shape = (schema as any)._def?.shape;
            if (shape) {
              const shapeKeys = Object.keys(shape);
              isWrappedSchema =
                shapeKeys.includes("body") ||
                shapeKeys.includes("params") ||
                shapeKeys.includes("query");
            }
          } catch (e2) {
            console.log("Error accessing schema shape:", e2);
          }
        }
      }

      // Debug logging
      console.log("Schema validation debug:", {
        isWrappedSchema,
        hasBody: !!req.body,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        hasParams: !!req.params,
        paramsKeys: req.params ? Object.keys(req.params) : [],
        hasQuery: !!req.query,
        queryKeys: req.query ? Object.keys(req.query) : [],
      });

      let result;

      if (isWrappedSchema) {
        // Create validation object based on what's available in request
        const validationData: any = {};

        // Always include body if it exists
        if (req.body && Object.keys(req.body).length > 0) {
          validationData.body = req.body;
        }

        // Include params if they exist
        if (req.params && Object.keys(req.params).length > 0) {
          validationData.params = req.params;
        }

        // Include query if it exists
        if (req.query && Object.keys(req.query).length > 0) {
          validationData.query = req.query;
        }

        console.log("Validating wrapped data:", validationData);

        // Validate the full request object
        result = schema.safeParse(validationData);
      } else {
        console.log("Validating unwrapped body:", req.body);

        // Backward compatibility - validate only body
        result = schema.safeParse(req.body);
      }

      if (!result.success) {
        console.log("Validation failed:", result.error.errors);
        res.status(422).json({
          success: false,
          message: "Validation failed",
          errors: result.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
        return;
      }

      console.log("Validation passed:", result.data);

      // Update request objects with validated data
      if (isWrappedSchema) {
        if (result.data.body) {
          req.body = result.data.body;
        }
        if (result.data.params) {
          req.params = result.data.params;
        }
        if (result.data.query) {
          req.query = result.data.query;
        }
      } else {
        // Backward compatibility
        req.body = result.data;
      }

      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      res.status(500).json({
        success: false,
        message: "Internal validation error",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Internal server error",
      });
      return;
    }
  };
