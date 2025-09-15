// Role.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "./User.js";
import { UserRole } from "./UserRole.js";

export const Role = sequelize.define(
  "Role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  },
  {
    tableName: "roles",
    schema: "auth",
    timestamps: false,
  }
);
