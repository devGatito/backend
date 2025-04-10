import express from 'express';
import {
  getAllProductos,
  getMinMax,
  getProductoById,
  addProducto,
  updateProducto,
  deleteProducto
} from '../../controllers/inventario/productoController.js';

const router = express.Router();

router.post('/', getAllProductos);
router.get('/precios', getMinMax);
router.get('/:id', getProductoById);
router.post('/agregar-producto', addProducto);
router.put('/actualizar-producto', updateProducto);
router.delete('/eliminar-producto/:id', deleteProducto);

export default router;
