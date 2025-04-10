import express from 'express';
import { insertDevolucion, getDevolucionById } from '../../controllers/finanzas/devolucionController.js';

const router = express.Router();

router.post("/registrar-devolucion/", insertDevolucion);
router.get("/obtener-devolucion/:id", getDevolucionById);

export default router;