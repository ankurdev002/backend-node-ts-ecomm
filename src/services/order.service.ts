import Order from "../models/order.model";
import OrderItem from "../models/orderItem.model";
import Cart from "../models/cart.model";
import { Product } from "../models/product.model";
import Inventory from "../models/inventory.model";
import Address from "../models/address.model";
import Payment from "../models/payment.model";
import Shipping from "../models/shipping.model";
import Notification from "../models/notification.model";
import { USER_ROLES } from "../constants/user_roles";
import { Op } from "sequelize";
import sequelize from "../config/db";

interface CreateOrderData {
  userId: number;
  shippingAddressId: number;
  billingAddressId?: number;
  paymentMethod: string;
  notes?: string;
}

export const createOrderFromCart = async (orderData: CreateOrderData) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      userId,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      notes,
    } = orderData;

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: Inventory, as: "inventory" }],
        },
      ],
      transaction,
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Validate addresses
    const shippingAddress = await Address.findOne({
      where: { id: shippingAddressId, userId },
      transaction,
    });

    if (!shippingAddress) {
      throw new Error("Invalid shipping address");
    }

    // Calculate order totals
    let totalAmount = 0;
    const orderItems = [];

    // Validate stock and calculate totals
    for (const cartItem of cartItems) {
      if (!cartItem.product.isActive) {
        throw new Error(
          `Product ${cartItem.product.name} is no longer available`
        );
      }

      const inventory = cartItem.product.inventory;
      if (inventory && !(await inventory.reserveStock(cartItem.quantity))) {
        throw new Error(`Insufficient stock for ${cartItem.product.name}`);
      }

      const itemTotal = cartItem.quantity * cartItem.price;
      totalAmount += itemTotal;

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        unitPrice: cartItem.price,
        totalPrice: itemTotal,
        selectedVariant: cartItem.selectedVariant,
      });
    }

    // Calculate shipping and tax (basic calculation)
    const shippingAmount = totalAmount > 100 ? 0 : 10; // Free shipping over $100
    const taxRate = 0.08; // 8% tax
    const taxAmount = totalAmount * taxRate;
    const finalAmount = totalAmount + shippingAmount + taxAmount;

    // Create order
    const order = await Order.create(
      {
        userId,
        totalAmount,
        discountAmount: 0,
        shippingAmount,
        taxAmount,
        finalAmount,
        shippingAddressId,
        billingAddressId: billingAddressId || shippingAddressId,
        paymentMethod,
        notes,
      },
      { transaction }
    );

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          ...item,
        },
        { transaction }
      );
    }

    // Create shipping record
    await Shipping.create(
      {
        orderId: order.id,
        shippingMethod: "Standard Shipping",
        shippingCost: shippingAmount,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      { transaction }
    );

    // Clear cart
    await Cart.destroy({ where: { userId }, transaction });

    // Create notification
    await Notification.create(
      {
        userId,
        title: "Order Placed Successfully",
        message: `Your order ${order.orderNumber} has been placed successfully.`,
        type: "order",
        relatedId: order.id,
        relatedType: "order",
      },
      { transaction }
    );

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getOrderById = async (
  orderId: number,
  userId: number,
  userType: string
) => {
  const whereClause: any = { id: orderId };

  // Role-based access control
  if (userType === USER_ROLES.NORMAL) {
    whereClause.userId = userId;
  } else if (userType === USER_ROLES.VENDOR) {
    whereClause.vendorId = userId;
  } else if (userType === USER_ROLES.DELIVERY) {
    whereClause.deliveryPersonId = userId;
  }
  // ADMIN can see all orders

  const order = await Order.findOne({
    where: whereClause,
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
      { model: Address, as: "shippingAddress" },
      { model: Address, as: "billingAddress" },
      { model: Payment, as: "payments" },
      { model: Shipping, as: "shipping" },
    ],
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const getUserOrders = async (userId: number, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows: orders } = await Order.findAndCountAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
      { model: Shipping, as: "shipping" },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalOrders: count,
      hasNext: page * limit < count,
      hasPrev: page > 1,
    },
  };
};

export const updateOrderStatus = async (
  orderId: number,
  status: string,
  userId: number,
  userType: string
) => {
  const order = await Order.findByPk(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Role-based status update permissions
  if (userType === USER_ROLES.NORMAL && !order.canBeCancelled()) {
    throw new Error("Cannot update order status");
  }

  if (userType === USER_ROLES.VENDOR && order.vendorId !== userId) {
    throw new Error("Unauthorized to update this order");
  }

  order.status = status as any;
  await order.save();

  // Create notification
  await Notification.create({
    userId: order.userId,
    title: "Order Status Updated",
    message: `Your order ${order.orderNumber} status has been updated to ${status}.`,
    type: "order",
    relatedId: order.id,
    relatedType: "order",
  });

  return order;
};

export const cancelOrder = async (orderId: number, userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: OrderItem, as: "items" }],
      transaction,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (!order.canBeCancelled()) {
      throw new Error("Order cannot be cancelled");
    }

    // Release reserved stock
    if (order.items) {
      for (const item of order.items) {
        const inventory = await Inventory.findOne({
          where: { productId: item.productId },
          transaction,
        });
        if (inventory) {
          await inventory.releaseStock(item.quantity);
        }
      }
    }

    // Update order status
    order.status = "cancelled";
    await order.save({ transaction });

    // Create notification
    await Notification.create(
      {
        userId,
        title: "Order Cancelled",
        message: `Your order ${order.orderNumber} has been cancelled successfully.`,
        type: "order",
        relatedId: order.id,
        relatedType: "order",
      },
      { transaction }
    );

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getOrdersByStatus = async (
  status: string,
  userType: string,
  userId?: number,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;
  const whereClause: any = { status };

  // Role-based filtering
  if (userType === USER_ROLES.VENDOR && userId) {
    whereClause.vendorId = userId;
  } else if (userType === USER_ROLES.DELIVERY && userId) {
    whereClause.deliveryPersonId = userId;
  } else if (userType === USER_ROLES.NORMAL && userId) {
    whereClause.userId = userId;
  }

  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
      { model: Address, as: "shippingAddress" },
      { model: Shipping, as: "shipping" },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalOrders: count,
    },
  };
};
