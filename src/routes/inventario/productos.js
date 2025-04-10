import { Router } from 'express';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../../controllers/inventario/productos.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.get('/', listarProductos);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;
