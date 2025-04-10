import {
    obtenerTrabajadores,
    insertarTrabajador,
    modificarTrabajador,
    eliminarTrabajadorPorId
  } from '../../models/trabajadores/trabajadores.model.js';
  
  export async function listarTrabajadores(req, res) {
    try {
      const trabajadores = await obtenerTrabajadores();
      res.json(trabajadores);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar trabajadores' });
    }
  }
  
  export async function crearTrabajador(req, res) {
    try {
      const nuevo = await insertarTrabajador(req.body);
      res.status(201).json({ message: 'Trabajador creado', id: nuevo });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear trabajador' });
    }
  }
  
  export async function actualizarTrabajador(req, res) {
    try {
      await modificarTrabajador(req.params.id, req.body);
      res.json({ message: 'Trabajador actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar trabajador' });
    }
  }
  
  export async function eliminarTrabajador(req, res) {
    try {
      await eliminarTrabajadorPorId(req.params.id);
      res.json({ message: 'Trabajador eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar trabajador' });
    }
  }
  