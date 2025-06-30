import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import {
  Category,
  ProductCategory,
  SubCategory,
  SuperCategory,
} from "./category.model";

// Define Product
interface Pricing {
  country: string;
  currency: string;
  currencySymbol: string;
  actualPrice: number;
  discountAmount: number;
  finalPrice: number;
}

interface ProductAttributes {
  id?: number;
  name: string;
  pricing: Pricing[];
  images: Record<string, string[]>; // Color-wise image storage
  productCategoryId?: number;
  superCategoryId?: number;
  categoryId?: number;
  subCategoryId?: number;
  isActive?: boolean;
  productType: string; // e.g., Electronics, Clothing, Raw Material
  attributes: Record<string, any>;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public pricing!: Pricing[];
  public images!: Record<string, string[]>;
  public productCategoryId!: number;
  public superCategoryId!: number;
  public categoryId!: number;
  public subCategoryId!: number;
  public isActive!: boolean;
  public productType!: string;
  public attributes!: Record<string, any>;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association getters
  public readonly inventory?: any;
  public readonly vendor?: any;
  public readonly cartItems?: any[];
  public readonly orderItems?: any[];
  public readonly reviews?: any[];
  public readonly wishlistItems?: any[];
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pricing: {
      type: DataTypes.JSON, // Array of country-wise pricing objects
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON, // Color-based image URLs
      allowNull: false,
    },
    productCategoryId: {
      type: DataTypes.INTEGER,
      references: { model: ProductCategory, key: "id" },
    },
    superCategoryId: {
      type: DataTypes.INTEGER,
      references: { model: SuperCategory, key: "id" },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: Category, key: "id" },
    },
    subCategoryId: {
      type: DataTypes.INTEGER,
      references: { model: SubCategory, key: "id" },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Default product is active
    },
    productType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attributes: {
      type: DataTypes.JSON, // Flexible product attributes
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "product", timestamps: true }
);

ProductCategory.hasMany(Product, {
  foreignKey: "productCategoryId",
  as: "products",
});
Product.belongsTo(ProductCategory, {
  foreignKey: "productCategoryId",
  as: "productCategory",
});

Product.belongsTo(SuperCategory, {
  foreignKey: "superCategoryId",
  as: "superCategory",
});
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Product.belongsTo(SubCategory, {
  foreignKey: "subCategoryId",
  as: "subCategory",
});

export { Category, Product, ProductCategory, SubCategory, SuperCategory };
