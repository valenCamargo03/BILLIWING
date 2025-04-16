import express from "express";
import cors from "cors";
import usersRoutes from "./routes/servicios.routes.js";
import gamesRoutes from "./routes/usuarios.router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(gamesRoutes);
app.use(usersRoutes);

export default app;
