import express from 'express';
import { getGanaciaMes, getGastoMes } from '../../controllers/finanzas/dashboardController.js'; 

const router = express.Router();

router.get("/obtener-ganancia-mes/", getGanaciaMes);
router.get("/obtener-gasto-mes/", getGastoMes);

export default router;