import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const UserRole = sequelize.define(
  "UserRole",
  {
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
  },
  {
    tableName: "users_roles",
    schema: "auth", // ⬅️ informar o schema correto
    timestamps: false,
  }
);
