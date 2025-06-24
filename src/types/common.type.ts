import { Request } from "express";

// Auth and Role Middleware Type Interface
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Paginattion Request and Middleware Type Interface
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
