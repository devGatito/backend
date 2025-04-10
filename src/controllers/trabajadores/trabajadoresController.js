import { TrabajadorRepository } from '../../models/trabajadores/trabajadores.js';

const TrabajadorRepo = new TrabajadorRepository();

export const insertTrabajador = async (req, res) => {
  try {
    const { nombreCompleto, cedula, salario, seguroSocial } = req.body;

    const trabajadorExistente = await TrabajadorRepo.findOne(cedula);
    if (trabajadorExistente) {
      return res.status(409).json({ error: "La cédula ya está registrada en el sistema." });
    }

    const trabajador = await TrabajadorRepo.insertTrabajador(nombreCompleto, cedula, salario, seguroSocial);
    res.status(201).json({ message: "Trabajador insertado correctamente", rowsAffected: trabajador });
  } catch (error) {
    console.error("Error al insertar trabajador:", error);
    res.status(500).json({ error: "Error al insertar trabajador" });
  }
};

export const getTrabajadores = async (req, res) => {
  try {
    const { nombreCompleto, cedula, salarioMin, salarioMax } = req.body;
    const trabajadores = await TrabajadorRepo.getTrabajadores(nombreCompleto, cedula, salarioMin, salarioMax);
    res.status(200).json(trabajadores);
  } catch (error) {
    console.error("Error al obtener trabajadores:", error);
    res.status(500).json({ error: "Error al obtener trabajadores" });
  }
};

export const getTrabajadorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const trabajador = await TrabajadorRepo.getTrabajadorById(id);
    res.status(200).json(trabajador);
  } catch (error) {
    console.error("Error al obtener trabajador:", error);
    res.status(500).json({ error: "Error al obtener trabajador" });
  }
};

export const updateTrabajador = async (req, res) => {
  try {
    const { idTrabajador, nombreCompleto, cedula, salario, seguroSocial } = req.body;
    const trabajador = await TrabajadorRepo.updateTrabajador(idTrabajador, nombreCompleto, cedula, salario, seguroSocial);
    res.status(200).json({ message: "Trabajador actualizado correctamente", rowsAffected: trabajador });
  } catch (error) {
    console.error("Error al actualizar trabajador:", error);
    res.status(500).json({ error: "Error al actualizar trabajador" });
  }
};

export const deleteTrabajador = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID de trabajador no proporcionado" });
    }

    const rowsAffected = await TrabajadorRepo.deleteTrabajador(id);
    if (rowsAffected > 0) {
      res.status(200).json({ message: "Trabajador eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Trabajador no encontrado" });
    }
  } catch (error) {
    console.error("Error eliminando trabajador:", error);
    res.status(500).json({ error: "Error eliminando trabajador" });
  }
};
