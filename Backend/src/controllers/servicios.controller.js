import { and, Op, where } from "sequelize";
import { Servicios } from "../models/servicios.js";
import { Usuarios } from "../models/usuarios.js";

export const getServicios = async (req, res) => {
  try {
    const servicio = await Servicios.findAll();
    res.json(servicio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createServicios = async (req, res) => {
  try {
    const { name, precio, descripcion } = req.body;

    const newServicio = await Servicios.create({
      name,
      precio,
      descripcion,
    });
    res.json(newServicio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postServicio = async (req, res) => {
  const { acount, password } = req.body;
  try {
    const servicios = await Servicios.findOne({
      where: {
        [Op.and]: [{ acount }, { password }],
      },
    });
    res.json(servicios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const servicio = await Servicios.findOne({
      where: { id },
    });
    servicio.set(req.body);
    await servicio.save();
    return res.json(servicio);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Servicios.destroy({
      where: { id },
    });
    console.log(result);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getServiciosUsuarios = async (req, res) => {
  const { id } = req.params;
  const usuarios = await Usuarios.findAll({
    where: { idUser: id },
  });

  res.json(usuarios);
};
