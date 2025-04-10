import { Router } from 'express';
import {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId
} from '../../controllers/ventas/ventas.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.post('/', crearVenta);
router.get('/', obtenerVentas);
router.get('/:id', obtenerVentaPorId);

export default router;
