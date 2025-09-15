// User.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { Role } from "./Role.js";
import { UserRole } from "./UserRole.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    cpf: DataTypes.STRING,
  },
  {
    tableName: "users",
    schema: "auth",
    timestamps: false,
  }
);
