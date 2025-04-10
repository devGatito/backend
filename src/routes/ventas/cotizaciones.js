import { Router } from 'express';
import {
  crearCotizacion,
  listarCotizaciones,
  obtenerCotizacionPorId,
  actualizarEstadoCotizacion
} from '../../controllers/ventas/cotizaciones.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.post('/', crearCotizacion);
router.get('/', listarCotizaciones);
router.get('/:id', obtenerCotizacionPorId);
router.put('/:id/estado', actualizarEstadoCotizacion);

export default router;  // Exportación por defecto
