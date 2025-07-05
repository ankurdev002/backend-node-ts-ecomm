import { Router } from "express";
import { ENDPOINTS } from "../constants/endpoint";
import {
  cancelUserOrder,
  createOrder,
  getOrder,
  getOrders,
  getOrdersByOrderStatus,
  updateOrder,
} from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  cancelOrderSchema,
  createOrderSchema,
  orderParamsSchema,
  orderQuerySchema,
  orderStatusParamsSchema,
  updateOrderStatusSchema,
} from "../schema/order.schema";

const router = Router();

// All order routes require authentication
router.use(authenticateUser);

// @route POST /api/orders
// @desc Create a new order from cart
// @access Private
router.post(
  ENDPOINTS.ORDER_ROUTE.CREATE_ORDER,
  validate(createOrderSchema),
  createOrder
);

// @route GET /api/orders
// @desc Get user orders with pagination
// @access Private
router.get(
  ENDPOINTS.ORDER_ROUTE.GET_ORDERS,
  validate(orderQuerySchema),
  getOrders
);

// @route GET /api/orders/status/:status
// @desc Get orders by status
// @access Private
router.get(
  ENDPOINTS.ORDER_ROUTE.GET_ORDER_BY_STATUS,
  validate(orderStatusParamsSchema),
  getOrdersByOrderStatus
);

// @route GET /api/orders/:orderId
// @desc Get specific order
// @access Private
router.get(
  ENDPOINTS.ORDER_ROUTE.GET_ORDER_BY_ID,
  validate(orderParamsSchema),
  getOrder
);

// @route PUT /api/orders/:orderId
// @desc Update order status
// @access Private
router.put(
  ENDPOINTS.ORDER_ROUTE.UPDATE_ORDER,
  validate(updateOrderStatusSchema),
  updateOrder
);

// @route PUT /api/orders/:orderId/cancel
// @desc Cancel order
// @access Private
router.put(
  ENDPOINTS.ORDER_ROUTE.CANCEL_ORDER,
  validate(cancelOrderSchema),
  cancelUserOrder
);

export default router;
