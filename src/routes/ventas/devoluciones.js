import { Router } from 'express';
import {
  crearDevolucion,
  obtenerDevoluciones,
  obtenerDevolucionPorId
} from '../../controllers/ventas/devoluciones.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.post('/', crearDevolucion);
router.get('/', obtenerDevoluciones);
router.get('/:id', obtenerDevolucionPorId);

export default router;
