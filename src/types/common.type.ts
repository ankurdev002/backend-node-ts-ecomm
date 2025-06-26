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

// Cart Item Interface
export interface CartItemWithProduct {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  selectedVariant?: Record<string, any>;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: number;
    name: string;
    pricing: any[];
    images: Record<string, string[]>;
    isActive: boolean;
    inventory?: {
      id: number;
      productId: number;
      quantity: number;
      reservedQuantity: number;
      availableQuantity: number;
      isLowStock: boolean;
      isOutOfStock: boolean;
    };
  };
}

// Order Item Interface
export interface OrderItemWithProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedVariant?: Record<string, any>;
  product: {
    id: number;
    name: string;
    pricing: any[];
    images: Record<string, string[]>;
  };
}

// Address Interface
export interface AddressType {
  id: number;
  userId: number;
  type: "billing" | "shipping";
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  isDefault: boolean;
}

// Pagination Interface
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}
