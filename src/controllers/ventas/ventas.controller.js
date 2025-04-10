import {
  insertarVenta,
  obtenerVentas as obtenerVentasDelModelo,  // Renombramos para evitar conflicto
  obtenerVenta
} from '../../models/ventas/ventas.model.js';

export async function crearVenta(req, res) {
  try {
    const id = await insertarVenta(req.body);
    res.status(201).json({ message: 'Venta creada', id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear venta' });
  }
}

// Renombramos la función para evitar conflicto de nombre
export async function obtenerVentas(req, res) {
  try {
    const ventas = await obtenerVentasDelModelo();  // Llamamos a la función del modelo
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
}

export async function obtenerVentaPorId(req, res) {
  try {
    const venta = await obtenerVenta(req.params.id);
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
}
