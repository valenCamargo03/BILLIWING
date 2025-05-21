import express from "express";
import cors from "cors";
import { sequelize } from "./database/database.js";

// Rutas
import usersRoutes from "./routes/servicios.routes.js";
import gamesRoutes from "./routes/usuarios.router.js";
import authRoutes from "./routes/auth.js";

// Modelos
import "./models/usuarios.js";
import "./models/servicios.js"; // si lo tienes

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", gamesRoutes);
app.use("/api/servicios", usersRoutes);

// Iniciar servidor y sincronizar base de datos
const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
  }
};

startServer();

export default app;

