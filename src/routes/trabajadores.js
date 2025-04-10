import { Router } from 'express';
import {
  listarTrabajadores,
  crearTrabajador,
  actualizarTrabajador,
  eliminarTrabajador
} from '../controllers/trabajadores/trabajadores.controller.js';

import { verificarAuth } from '../middlewares/auth.js';

const router = Router();

router.use(verificarAuth); // proteger todas las rutas

router.get('/', listarTrabajadores);
router.post('/', crearTrabajador);
router.put('/:id', actualizarTrabajador);
router.delete('/:id', eliminarTrabajador);

export default router;
