import { Router } from 'express';
import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../controllers/clientes/clientes.controller.js';

import { verificarAuth } from '../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.get('/', listarClientes);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;
