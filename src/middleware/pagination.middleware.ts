import { NextFunction, Request, Response } from "express";
import { FindOptions, Model, ModelStatic, WhereOptions } from "sequelize";

export interface PaginatedRequest extends Request {
  paginatedData?: {
    pagination: {
      totalResults: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    data: any[];
  };
}

const paginate =
  (
    model: ModelStatic<Model>,
    includeOptions: FindOptions["include"] = [],
    baseWhereCondition?: WhereOptions
  ) =>
  async (req: PaginatedRequest, res: Response, next: NextFunction) => {
    try {
      let { page, limit } = req.query;

      const pageNumber = parseInt(page as string, 10) || 1;
      const pageSize = parseInt(limit as string, 10) || 10;
      const offset = (pageNumber - 1) * pageSize;

      const whereCondition: WhereOptions = { ...baseWhereCondition };

      Object.keys(req.query).forEach((key) => {
        if (req.query[key] !== undefined) {
          (whereCondition as Record<string, any>)[key] = req.query[key];
        }
      });

      const { count, rows } = await model.findAndCountAll({
        where: whereCondition || {},
        include: includeOptions,
        limit: pageSize,
        offset,
      });

      req.paginatedData = {
        pagination: {
          totalResults: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageNumber,
          pageSize,
          hasNextPage: pageNumber * pageSize < count,
          hasPrevPage: pageNumber > 1,
        },
        data: rows,
      };
      next(); // Move to the next middleware/controller
    } catch (error) {
      res.status(500).json({ error: "Pagination failed", details: error });
    }
  };

export default paginate;
