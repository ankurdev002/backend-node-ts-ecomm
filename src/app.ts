import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import { authenticateUser } from "./middleware/auth.middleware";
import { authorizeRole } from "./middleware/role.middleware";
import { USER_ROLES } from "./constants/user_roles";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use(
  "/api/admin/cat",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN]),
  categoryRoutes
);
app.use(
  "/api/products",
  authenticateUser,
  authorizeRole([USER_ROLES.ADMIN, USER_ROLES.VENDOR]),
  productRoutes
);

app.get("/", (req: Request, res: Response) => {
  res.send("API IS UP...");
});

export default app;
