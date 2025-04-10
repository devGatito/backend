import express from "express";
import {
  insertVenta,
  getVentas,
  getVentaById,
  agregarProducto,
  getProductosVenta,
  deleteProductoVenta
} from "../../controllers/ventas/ventasController.js";

const router = express.Router();

router.post("/registrar-venta/", insertVenta);
router.post("/obtener-ventas", getVentas);
router.get("/obtener-venta/:id", getVentaById);
router.post("/agregar-producto/", agregarProducto);
router.get("/obtener-productos-venta/:id", getProductosVenta);
router.post("/eliminar-producto-venta/", deleteProductoVenta);

export default router;
