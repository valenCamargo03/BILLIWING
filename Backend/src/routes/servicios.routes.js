import { Router } from "express";
import { createServicios, deleteServicio, getServicios, updateServicio, getServiciosUsuarios, postServicio } from "../controllers/servicios.controller.js";
const router = Router();

router.get("/users", getServicios);
router.post("/users", createServicios);
router.put("/users/:id", updateServicio);
router.delete("/users/:id", deleteServicio);
router.post("/user/login", postServicio);
router.get("/users/:id/games", getServiciosUsuarios);

export default router;
