import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import addressRoutes from "./routes/address.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import shippingRoutes from "./routes/shipping.routes";
import reviewRoutes from "./routes/review.routes";
import adminRoutes from "./routes/admin.routes";
import vendorRoutes from "./routes/vendor.routes";
import deliveryRoutes from "./routes/delivery.routes";
import inventoryRoutes from "./routes/inventory.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import couponRoutes from "./routes/coupon.routes";
import { authenticateUser } from "./middleware/auth.middleware";
import { authorizeRole } from "./middleware/role.middleware";
import { USER_ROLES } from "./constants/user_roles";

const app = express();
app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true, // Allow cookies to be sent with requests
//   })
// );
app.use(helmet());
app.use(morgan("dev"));

// Public routes
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/shipping", shippingRoutes);

// Protected routes with role-based access
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use(
  "/api/admin/categories",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  categoryRoutes
);

// Vendor routes
app.use("/api/vendor", vendorRoutes);
app.use(
  "/api/products",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN, USER_ROLES.VENDOR]),
  productRoutes
);

// Delivery routes
app.use("/api/delivery", deliveryRoutes);

// Inventory routes
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API IS UP...");
});

export default app;
