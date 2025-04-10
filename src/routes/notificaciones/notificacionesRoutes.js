import express from 'express';
import { getNotificaciones, EliminarNotificacion } from '../../controllers/notificaciones/notificacionesController.js';

const router = express.Router();

router.post('/obtener-notificaciones/', getNotificaciones);
router.delete('/eliminar-notificacion/:id', EliminarNotificacion);

export default router;
