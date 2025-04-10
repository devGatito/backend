import {
    obtenerOrdenes,
    crearNuevaOrden,
    obtenerOrden,
    actualizarEstado,
    eliminarOrdenPorId
  } from '../../models/flujo/ordenes.model.js';
  
  export async function listarOrdenes(req, res) {
    try {
      const ordenes = await obtenerOrdenes();
      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar órdenes' });
    }
  }
  
  export async function crearOrden(req, res) {
    try {
      const id = await crearNuevaOrden(req.body);
      res.status(201).json({ message: 'Orden creada', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear orden' });
    }
  }
  
  export async function obtenerOrdenPorId(req, res) {
    try {
      const orden = await obtenerOrden(req.params.id);
      res.json(orden);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la orden' });
    }
  }
  
  export async function actualizarEstadoOrden(req, res) {
    try {
      await actualizarEstado(req.params.id, req.body.estado);
      res.json({ message: 'Estado actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  }
  
  export async function eliminarOrden(req, res) {
    try {
      await eliminarOrdenPorId(req.params.id);
      res.json({ message: 'Orden eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar orden' });
    }
  }
  