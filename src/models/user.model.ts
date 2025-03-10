import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface UserAttributes {
  id?: Number;
  name: string;
  email: string;
  password: string;
  userType: "admin" | "vendor" | "delivery" | "normal";
  currentOtp?: string | null; // Stores OTP, nullable
  isVerified: boolean; // Checks if user is verified
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: Number;
  public name!: string;
  public email!: string;
  public password!: string;
  public userType!: "admin" | "vendor" | "delivery" | "normal";
  public currentOtp!: string | null;
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Ensure it's required
    },
    userType: {
      type: DataTypes.ENUM("admin", "vendor", "delivery", "normal"),
      allowNull: false,
      defaultValue: "normal", // Default user type
    },
    currentOtp: {
      type: DataTypes.STRING(6), // 6-digit OTP
      allowNull: true, // Nullable because it will be removed after verification
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default is false, user needs to verify
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
