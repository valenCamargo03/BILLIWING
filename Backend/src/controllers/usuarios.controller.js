import { where } from "sequelize";
import { Usuarios } from "../models/usuarios.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findOne({
      where: {
        id,
      },
    });
    if (!usuario) return res.status(404).json({ message: "The game does not exists" });
    res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createUsuarios = async (req, res) => {
  const { name, plataform, stars, acount, description, idUser } = req.body;

  try {
    const newUsuario = await Usuarios.create({
      name,
      apellido,
      edad,
      email,
      contraseña,
      idServicio,
    });
    res.json(newUsuario);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findOne({
      where: { id },
    });
    usuario.set(req.body);
    await usuario.save();
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await Usuarios.destroy({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
