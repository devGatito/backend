import express from 'express';
import { 
    getAllProveedor, 
    getProveedorById 
} from '../../controllers/inventario/proveedorController.js';

const router = express.Router();

// Rutas para proveedores
router.get("/", getAllProveedor); // GET /api/proveedor
router.get("/:id", getProveedorById); // GET /api/proveedor/:id

export default router;
