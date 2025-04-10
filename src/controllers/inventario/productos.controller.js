import {
    obtenerProductos,
    insertarProducto,
    modificarProducto,
    eliminarProductoPorId
  } from '../../models/inventario/productos.model.js';
  
  export async function listarProductos(req, res) {
    try {
      const productos = await obtenerProductos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar productos' });
    }
  }
  
  export async function crearProducto(req, res) {
    try {
      const id = await insertarProducto(req.body);
      res.status(201).json({ message: 'Producto creado', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear producto' });
    }
  }
  
  export async function actualizarProducto(req, res) {
    try {
      await modificarProducto(req.params.id, req.body);
      res.json({ message: 'Producto actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }
  
  export async function eliminarProducto(req, res) {
    try {
      await eliminarProductoPorId(req.params.id);
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
  