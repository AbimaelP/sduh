// associations.js
import { User } from "./User.js";
import { Role } from "./Role.js";
import { UserRole } from "./UserRole.js";

// Relação many-to-many
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
});
