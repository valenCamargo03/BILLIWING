import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuarios } from "./usuarios.js";

export const Servicios = sequelize.define("Servicios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  precio: {
    type: DataTypes.INTEGER,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
});

Servicios.hasMany(Usuarios, {
  foreignKey: "idUser",
  sourceKey: "id",
});

Usuarios.belongsTo(Servicios, {
  foreignKey: "idUser",
  targetId: "id",
});
