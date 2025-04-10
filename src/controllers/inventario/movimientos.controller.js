import {
    obtenerMovimientos,
    insertarMovimiento,
    obtenerMovimientosPorProducto
  } from '../../models/inventario/movimientos.model.js';
  
  export async function listarMovimientos(req, res) {
    try {
      const movimientos = await obtenerMovimientos();
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar movimientos' });
    }
  }
  
  export async function registrarMovimiento(req, res) {
    try {
      const id = await insertarMovimiento(req.body);
      res.status(201).json({ message: 'Movimiento registrado', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar movimiento' });
    }
  }
  
  export async function historialPorProducto(req, res) {
    try {
      const movimientos = await obtenerMovimientosPorProducto(req.params.id);
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener historial' });
    }
  }
  