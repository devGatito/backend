import express from 'express';
import { getAllMarcas, getMarcaById } from '../../controllers/inventario/marcaController.js';

const router = express.Router();

// Rutas para obtener marcas
router.get("/", getAllMarcas); // GET /marca
router.get("/:id", getMarcaById); // GET /marca/:id

export default router;
