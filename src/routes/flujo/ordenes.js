import { Router } from 'express';
import {
  listarOrdenes,
  crearOrden,
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  eliminarOrden
} from '../../controllers/flujo/ordenes.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.get('/', listarOrdenes);
router.get('/:id', obtenerOrdenPorId);
router.post('/', crearOrden);
router.put('/:id/estado', actualizarEstadoOrden);
router.delete('/:id', eliminarOrden);

export default router;
