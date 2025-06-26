import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface WishlistAttributes {
  id?: number;
  userId: number;
  productId: number;
  createdAt?: Date;
}

interface WishlistCreationAttributes
  extends Optional<WishlistAttributes, "id"> {}

class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
  public id!: number;
  public userId!: number;
  public productId!: number;
  public readonly createdAt!: Date;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "wishlist",
    timestamps: true,
    updatedAt: false, // Only track when item was added
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);

export default Wishlist;
