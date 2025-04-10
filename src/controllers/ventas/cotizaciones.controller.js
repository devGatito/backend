import {
  insertarCotizacion,
  obtenerCotizaciones,
  obtenerCotizacion,
  actualizarEstadoCotizacion as actualizarEstadoCotizacionEnDB  // Renombramos para evitar conflicto
} from '../../models/ventas/cotizaciones.model.js';

export async function crearCotizacion(req, res) {
  try {
    const { idCliente, total, estado } = req.body;  // Asegúrate de que los datos sean correctos
    if (!idCliente || !total || !estado) {
      return res.status(400).json({ error: 'Faltan campos necesarios' });
    }

    const id = await insertarCotizacion({ idCliente, total, estado });  // Llamada a la función que inserta la cotización en el modelo
    res.status(201).json({ message: 'Cotización creada', id });
  } catch (error) {
    console.error('Error al crear cotización:', error);  // Muestra el error en la consola
    res.status(500).json({ error: 'Error al crear cotización' });
  }
}
export async function listarCotizaciones(req, res) {
  try {
    const cotizaciones = await obtenerCotizaciones();
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
}

export async function obtenerCotizacionPorId(req, res) {
  try {
    const cotizacion = await obtenerCotizacion(req.params.id);
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cotización' });
  }
}

export async function actualizarEstadoCotizacion(req, res) {
  try {
    // Usamos la función renombrada que está en el modelo
    await actualizarEstadoCotizacionEnDB(req.params.id, req.body.estado);  
    res.json({ message: 'Estado de cotización actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
}
