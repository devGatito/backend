import {
  insertarDevolucion,
  obtenerDevoluciones as obtenerDevolucionesDelModelo,  // Renombramos la función importada
  obtenerDevolucion
} from '../../models/ventas/devoluciones.model.js';

export async function crearDevolucion(req, res) {
  try {
    const id = await insertarDevolucion(req.body);
    res.status(201).json({ message: 'Devolución creada', id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear devolución' });
  }
}

export async function obtenerDevoluciones(req, res) {
  try {
    const devoluciones = await obtenerDevolucionesDelModelo();  // Llamamos a la función del modelo
    res.json(devoluciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener devoluciones' });
  }
}

export async function obtenerDevolucionPorId(req, res) {
  try {
    const devolucion = await obtenerDevolucion(req.params.id);
    res.json(devolucion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la devolución' });
  }
}
