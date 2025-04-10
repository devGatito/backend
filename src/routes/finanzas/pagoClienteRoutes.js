import express from 'express';
import { 
  insertPagoCliente, 
  getPagoClienteById 
} from '../../controllers/finanzas/pagoClienteController.js';

const router = express.Router();

router.post("/registrar-pago/", insertPagoCliente);
router.get("/obtener-pago/:id", getPagoClienteById);

export default router;