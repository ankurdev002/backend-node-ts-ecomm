import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

// Define SuperCategory
class SuperCategory extends Model {
  public id!: number;
  public name!: string;
  public isActive!: boolean;
}
SuperCategory.init(
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize, modelName: "super_category", timestamps: true }
);

// Define Category
class Category extends Model {
  public id!: number;
  public name!: string;
  public superCategoryId!: number;
  public isActive!: boolean;
}
Category.init(
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
    superCategoryId: {
      type: DataTypes.INTEGER,
      references: { model: SuperCategory, key: "id" },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize, modelName: "category", timestamps: true }
);

// Define SubCategory
class SubCategory extends Model {
  public id!: number;
  public name!: string;
  public categoryId!: number;
  public superCategoryId!: number;
  public isActive!: boolean;
}
SubCategory.init(
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
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: Category, key: "id" },
    },
    superCategoryId: {
      type: DataTypes.INTEGER,
      references: { model: SuperCategory, key: "id" },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize, modelName: "sub_category", timestamps: true }
);

// Define ProductCategory
class ProductCategory extends Model {
  public id!: number;
  public name!: string;
  public superCategoryId!: number;
  public categoryId!: number;
  public subCategoryId!: number;
  public isActive!: boolean;
}
ProductCategory.init(
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
      defaultValue: true,
    },
  },
  { sequelize, modelName: "product_category", timestamps: true }
);

// Define Associations
SuperCategory.hasMany(Category, {
  foreignKey: "superCategoryId",
  as: "categories",
});
Category.belongsTo(SuperCategory, {
  foreignKey: "superCategoryId",
  as: "superCategory",
});

Category.hasMany(SubCategory, {
  foreignKey: "categoryId",
  as: "subCategories",
});
SubCategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

SubCategory.hasMany(ProductCategory, {
  foreignKey: "subCategoryId",
  as: "productCategories",
});
ProductCategory.belongsTo(SubCategory, {
  foreignKey: "subCategoryId",
  as: "subCategory",
});

export { Category, ProductCategory, SubCategory, SuperCategory };

