import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_USER, DB_PASS } from "./config.js"; // variáveis de ambiente

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "postgres",
  logging: false, // desliga logs SQL
});

// Testar conexão
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com Postgres OK!");
  } catch (err) {
    console.error("Erro ao conectar no Postgres:", err);
  }
};
