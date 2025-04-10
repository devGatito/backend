import { Router } from 'express';
import {
  listarVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
} from '../../controllers/flujo/vehiculos.controller.js';

import { verificarAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(verificarAuth);

router.get('/', listarVehiculos);
router.post('/', crearVehiculo);
router.put('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;
