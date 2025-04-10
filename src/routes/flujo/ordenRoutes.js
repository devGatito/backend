import express from 'express';
import { 
  insertOrden,
  getOrdenesByStatus,
  getOrdenById,
  siguienteFase,
  updateOrden
} from '../../controllers/flujo/ordenController.js';

const router = express.Router();

// Ruta para agregar orden
router.post("/agregar-orden/", insertOrden);

// Ruta para obtener lista de ordenes según su estado
router.get("/obtener-ordenes/:id", getOrdenesByStatus);

// Ruta para obtener orden por ID
router.get("/obtener-orden/:id", getOrdenById);

// Ruta para actualizar fase de orden (0 = cancelar)
router.put("/actualizar-fase-orden/", siguienteFase);

// Ruta para actualizar orden completa
router.put("/actualizar-orden/", updateOrden);

export default router;