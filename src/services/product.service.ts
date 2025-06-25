import { USER_ROLES } from "../constants/user_roles";
import {
    Category,
    ProductCategory,
    SubCategory,
    SuperCategory,
} from "../models/category.model";
import { Product } from "../models/product.model";
import User from "../models/user.model";

export const createProduct = async (userId: number, data: any) => {
  if (!userId) throw new Error("User ID is required");
  return await Product.create({ userId, ...data });
};

export const getProductByIdWithRole = async (
  productId: string,
  userId: number
) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ["userType"],
  });

  if (!user) throw new Error("User not found");

  const where: any = { id: productId };

  if (user.userType === USER_ROLES.ADMIN) {
    // No filter // Admin can access all products (active & inactive)
  } else if (user.userType === USER_ROLES.NORMAL) {
    where.isActive = true; // Normal users can only see active products
  } else if (user.userType === USER_ROLES.VENDOR) {
    where.userId = userId; // Vendors can see only their own products
  } else {
    throw new Error("Unauthorized user type");
  }

  const product = await Product.findOne({
    where,
    include: [
      {
        model: SuperCategory,
        as: "superCategory",
        attributes: ["id", "name", "isActive"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "isActive"],
      },
      {
        model: SubCategory,
        as: "subCategory",
        attributes: ["id", "name", "isActive"],
      },
      {
        model: ProductCategory,
        as: "productCategory",
        attributes: ["id", "name", "isActive"],
      },
    ],
  });

  return product;
};

export const updateProduct = async (
  productId: string,
  userId: number,
  data: any
) => {
  const product = await Product.findOne({ where: { id: productId, userId } });
  if (!product)
    throw new Error(
      "Product not found or not authorized for updating the product"
    );
  return await product.update(data);
};

export const deleteProduct = async (productId: string, userId: number) => {
  const product = await Product.findOne({ where: { id: productId, userId } });
  if (!product)
    throw new Error(
      "Product not found or not authorized for deleting the product"
    );
  return await product.update({ isActive: false }); // soft delete
};
