import { Router } from "express";
const router = Router();
import { getUsuarios, createUsuarios, updateUsuario, deleteUsuario, getUsuario } from "../controllers/usuarios.controller.js";

router.get("/games", getUsuarios);
router.post("/games", createUsuarios);
router.put("/games/:id", updateUsuario);
router.delete("/games/:id", deleteUsuario);
router.get("/games/:id", getUsuario);

export default router;
