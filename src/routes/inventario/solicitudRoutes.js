import express from 'express';
import { 
    getAllSolicitud, 
    addSolicitud, 
    updateSolicitud 
} from '../../controllers/inventario/solicitudController.js';

const router = express.Router();

// Rutas para solicitudes
router.get("/solicitud", getAllSolicitud); // GET /solicitud
router.post("/agregar-solicitud", addSolicitud); // POST /agregar-solicitud
router.put("/procesar-solicitud", updateSolicitud); // PUT /procesar-solicitud

export default router;
