import express from 'express';
import { getAllCategorias, getCategoriaById } from '../../controllers/inventario/categoriaController.js';

const router = express.Router();

// Rutas para obtener categorías
router.get("/", getAllCategorias); // GET /categorias
router.get("/:id", getCategoriaById); // GET /categorias/:id

export default router;
