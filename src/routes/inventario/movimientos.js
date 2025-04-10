import { Router } from 'express';
import {
  listarMovimientos,
  registrarMovimiento,
  historialPorProducto
} from '../../controllers/inventario/movimientos.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.get('/', listarMovimientos);
router.post('/', registrarMovimiento);
router.get('/producto/:id', historialPorProducto);

export default router;
