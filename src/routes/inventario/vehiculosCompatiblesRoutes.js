import express from 'express';
import { 
    getAllVehiculos, 
    getVehiculoById 
} from '../../controllers/inventario/vehiculosCompatiblesController.js';

const router = express.Router();

// Rutas para vehículos compatibles
router.get("/", getAllVehiculos); // GET /vehiculos
router.get("/:id", getVehiculoById); // GET /vehiculos/:id

export default router;
