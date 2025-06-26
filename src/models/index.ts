// Import all models
import User from "./user.model";
import Address from "./address.model";
import Cart from "./cart.model";
import { Product } from "./product.model";
import Inventory from "./inventory.model";
import Order from "./order.model";
import OrderItem from "./orderItem.model";
import Payment from "./payment.model";
import Shipping from "./shipping.model";
import Review from "./review.model";
import Coupon from "./coupon.model";
import Notification from "./notification.model";
import Wishlist from "./wishlist.model";
import {
  Category,
  ProductCategory,
  SubCategory,
  SuperCategory,
} from "./category.model";

// User Associations
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "customer" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Wishlist, { foreignKey: "userId", as: "wishlistItems" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });

// Vendor/Delivery Person Associations
User.hasMany(Order, { foreignKey: "vendorId", as: "vendorOrders" });
Order.belongsTo(User, { foreignKey: "vendorId", as: "vendor" });

User.hasMany(Order, { foreignKey: "deliveryPersonId", as: "deliveryOrders" });
Order.belongsTo(User, { foreignKey: "deliveryPersonId", as: "deliveryPerson" });

User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "vendor" });

// Product Associations
Product.hasOne(Inventory, { foreignKey: "productId", as: "inventory" });
Inventory.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Cart, { foreignKey: "productId", as: "cartItems" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Wishlist, { foreignKey: "productId", as: "wishlistItems" });
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Order Associations
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Order.hasMany(Payment, { foreignKey: "orderId", as: "payments" });
Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Order.hasOne(Shipping, { foreignKey: "orderId", as: "shipping" });
Shipping.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Order.hasMany(Review, { foreignKey: "orderId", as: "reviews" });
Review.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Address Associations
Address.hasMany(Order, {
  foreignKey: "shippingAddressId",
  as: "shippingOrders",
});
Order.belongsTo(Address, {
  foreignKey: "shippingAddressId",
  as: "shippingAddress",
});

Address.hasMany(Order, { foreignKey: "billingAddressId", as: "billingOrders" });
Order.belongsTo(Address, {
  foreignKey: "billingAddressId",
  as: "billingAddress",
});

// Export all models
export {
  User,
  Address,
  Cart,
  Product,
  Inventory,
  Order,
  OrderItem,
  Payment,
  Shipping,
  Review,
  Coupon,
  Notification,
  Wishlist,
  Category,
  ProductCategory,
  SubCategory,
  SuperCategory,
};

export default {
  User,
  Address,
  Cart,
  Product,
  Inventory,
  Order,
  OrderItem,
  Payment,
  Shipping,
  Review,
  Coupon,
  Notification,
  Wishlist,
  Category,
  ProductCategory,
  SubCategory,
  SuperCategory,
};
