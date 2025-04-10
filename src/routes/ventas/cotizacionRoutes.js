import express from "express";
import {
  insertCotizacion,
  getCotizacion,
  getCotizacionById,
  updateCotizacion,
  deleteCotizacion
} from "../../controllers/ventas/cotizacionController.js";

const router = express.Router();

router.post("/agregar-cotizacion/", insertCotizacion);
router.get("/obtener-cotizaciones", getCotizacion);
router.get("/obtener-cotizacion/:id", getCotizacionById);
router.put("/actualizar-cotizacion/", updateCotizacion);
router.delete("/eliminar-cotizacion/:id", deleteCotizacion);

export default router;
