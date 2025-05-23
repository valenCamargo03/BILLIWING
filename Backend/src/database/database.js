import Sequelize from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "Contaduria", 
  process.env.DB_USER || "postgres", 
  process.env.DB_PASSWORD || "admin", {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
