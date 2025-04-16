import Sequelize from "sequelize";

export const sequelize = new Sequelize("Contaduria", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
});
