import express from 'express';
import {
  insertTrabajador,
  getTrabajadores,
  getTrabajadorById,
  updateTrabajador,
  deleteTrabajador
} from '../../controllers/trabajadores/trabajadoresController.js';

const router = express.Router();

router.post('/agregar-trabajador', insertTrabajador);
router.get('/obtener-trabajadores', getTrabajadores);
router.get('/obtener-trabajador/:id', getTrabajadorById);
router.put('/actualizar-trabajador', updateTrabajador);
router.delete('/eliminar-trabajador/:id', deleteTrabajador);

export default router;
