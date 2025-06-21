import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import { authenticateUser, authorizeRole } from "./middleware/auth.middleware";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use(
  "/api/admin/cat",
  authenticateUser,
  authorizeRole(["admin"]),
  categoryRoutes
);
app.use(
  "/api/products",
  authenticateUser,
  authorizeRole(["admin", "vendor"]),
  productRoutes
);

app.get("/", (req: Request, res: Response) => {
  res.send("API IS UP...");
});

export default app;
