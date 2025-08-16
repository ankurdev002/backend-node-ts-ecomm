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

    // Get cart items without include to avoid association issues
    const cartItems = await Cart.findAll({
      where: { userId },
      transaction,
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Get products and inventory separately for each cart item
    const cartItemsWithProducts = [];
    for (const cartItem of cartItems) {
      const product = await Product.findByPk(cartItem.productId, {
        transaction,
      });
      const inventory = await Inventory.findOne({
        where: { productId: cartItem.productId },
        transaction,
      });

      if (product) {
        cartItemsWithProducts.push({
          ...cartItem.toJSON(),
          product: {
            ...product.toJSON(),
            inventory: inventory ? inventory.toJSON() : null,
          },
        });
      }
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
    for (const cartItem of cartItemsWithProducts) {
      if (!cartItem.product.isActive) {
        throw new Error(
          `Product ${cartItem.product.name} is no longer available`
        );
      }

      const inventoryData = cartItem.product.inventory;
      if (inventoryData) {
        // Get the actual inventory instance to call reserveStock method
        const inventory = await Inventory.findOne({
          where: { productId: cartItem.productId },
          transaction,
        });

        if (inventory && !(await inventory.reserveStock(cartItem.quantity))) {
          throw new Error(`Insufficient stock for ${cartItem.product.name}`);
        }
      } else {
        throw new Error(`No inventory found for ${cartItem.product.name}`);
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

    // Generate unique order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderNumber = `ORD-${timestamp}-${random}`;

    // Create order
    const order = await Order.create(
      {
        orderNumber,
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

  // Get order without include to avoid association issues
  const order = await Order.findOne({
    where: whereClause,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Get related data separately
  // Get order items
  const orderItems = await OrderItem.findAll({
    where: { orderId: order.id },
  });

  // Get products for each order item
  const itemsWithProducts = [];
  for (const item of orderItems) {
    const product = await Product.findByPk(item.productId);
    itemsWithProducts.push({
      ...item.toJSON(),
      product: product ? product.toJSON() : null,
    });
  }

  // Get addresses
  const shippingAddress = await Address.findByPk(order.shippingAddressId);
  const billingAddress = order.billingAddressId
    ? await Address.findByPk(order.billingAddressId)
    : null;

  // Get payments
  const payments = await Payment.findAll({
    where: { orderId: order.id },
  });

  // Get shipping
  const shipping = await Shipping.findOne({
    where: { orderId: order.id },
  });

  // Combine all data
  const orderWithDetails = {
    ...order.toJSON(),
    items: itemsWithProducts,
    shippingAddress: shippingAddress ? shippingAddress.toJSON() : null,
    billingAddress: billingAddress ? billingAddress.toJSON() : null,
    payments: payments.map((payment) => payment.toJSON()),
    shipping: shipping ? shipping.toJSON() : null,
  };

  return orderWithDetails;
};

export const getUserOrders = async (userId: number, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Get orders without include to avoid association issues
  const { count, rows: orders } = await Order.findAndCountAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  // Fetch related data separately for each order
  const ordersWithDetails = [];
  for (const order of orders) {
    // Get order items
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
    });

    // Get products for each order item
    const itemsWithProducts = [];
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId);
      itemsWithProducts.push({
        ...item.toJSON(),
        product: product ? product.toJSON() : null,
      });
    }

    // Get shipping info
    const shipping = await Shipping.findOne({
      where: { orderId: order.id },
    });

    // Combine all data
    ordersWithDetails.push({
      ...order.toJSON(),
      items: itemsWithProducts,
      shipping: shipping ? shipping.toJSON() : null,
    });
  }

  return {
    orders: ordersWithDetails,
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
  userType: string,
  paymentStatus: string
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
  order.paymentStatus = paymentStatus as any;
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
    // Get order without include to avoid association issues
    const order = await Order.findOne({
      where: { id: orderId, userId },
      transaction,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (!order.canBeCancelled()) {
      throw new Error("Order cannot be cancelled");
    }

    // Get order items separately
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      transaction,
    });

    // Release reserved stock
    for (const item of orderItems) {
      const inventory = await Inventory.findOne({
        where: { productId: item.productId },
        transaction,
      });
      if (inventory) {
        await inventory.releaseStock(item.quantity);
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

  // Get orders without include to avoid association issues
  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  // Fetch related data separately for each order
  const ordersWithDetails = [];
  for (const order of orders) {
    // Get order items
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
    });

    // Get products for each order item
    const itemsWithProducts = [];
    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId);
      itemsWithProducts.push({
        ...item.toJSON(),
        product: product ? product.toJSON() : null,
      });
    }

    // Get shipping address
    const shippingAddress = await Address.findByPk(order.shippingAddressId);

    // Get shipping info
    const shipping = await Shipping.findOne({
      where: { orderId: order.id },
    });

    // Combine all data
    ordersWithDetails.push({
      ...order.toJSON(),
      items: itemsWithProducts,
      shippingAddress: shippingAddress ? shippingAddress.toJSON() : null,
      shipping: shipping ? shipping.toJSON() : null,
    });
  }

  return {
    orders: ordersWithDetails,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalOrders: count,
    },
  };
};
