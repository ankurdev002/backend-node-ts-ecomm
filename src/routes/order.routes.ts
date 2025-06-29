import { Router } from "express";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  cancelUserOrder,
  getOrdersByOrderStatus,
} from "../controllers/order.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import paginate from "../middleware/pagination.middleware";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All order routes require authentication
router.use(authenticateUser);

// @route POST /api/orders
// @desc Create a new order from cart
// @access Private
router.post(ENDPOINTS.ORDER_ROUTE.CREATE_ORDER, createOrder);

// @route GET /api/orders
// @desc Get user orders with pagination
// @access Private
router.get(ENDPOINTS.ORDER_ROUTE.GET_ORDERS, getOrders);

// @route GET /api/orders/status/:status
// @desc Get orders by status
// @access Private
router.get(ENDPOINTS.ORDER_ROUTE.GET_ORDER_BY_STATUS, getOrdersByOrderStatus);

// @route GET /api/orders/:orderId
// @desc Get specific order
// @access Private
router.get(ENDPOINTS.ORDER_ROUTE.GET_ORDER_BY_ID, getOrder);

// @route PUT /api/orders/:orderId
// @desc Update order status
// @access Private
router.put(ENDPOINTS.ORDER_ROUTE.UPDATE_ORDER, updateOrder);

// @route PUT /api/orders/:orderId/cancel
// @desc Cancel order
// @access Private
router.put(ENDPOINTS.ORDER_ROUTE.CANCEL_ORDER, cancelUserOrder);

export default router;
