import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Usuarios = sequelize.define("Usuarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  apellido: {
    type: DataTypes.STRING,
  },
  edad: {
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
  },
  contraseña: {
    type: DataTypes.STRING,
  },
});
