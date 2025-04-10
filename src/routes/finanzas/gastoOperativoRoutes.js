import express from 'express';
import { 
  insertGastoOperativo, 
  getGastoOperativos 
} from '../../controllers/finanzas/gastoOperativoController.js';

const router = express.Router();

router.post("/agregar-gasto-operativo/", insertGastoOperativo);
router.get("/obtener-gastos-operativos/", getGastoOperativos);

export default router;