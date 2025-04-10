"use strict";

import { ProductoRepository } from "../../models/inventario/producto.js";

const ProductoRepo = new ProductoRepository();

// Obtener todos los productos - filtros y paginación
export const getAllProductos = async (req, res) => {
    try {
        const { nombre, marca, categoria, stock, rangoPrecio } = req.body;

        const producto = await ProductoRepo.getAll(nombre, marca, categoria, stock, rangoPrecio); // Get
        res.json(producto); // Return exitoso
    } catch (error) {
        res.status(500).json({ error: "C-Error al obtener los productos" });
    }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "El parámetro id debe ser un número válido" });
        }
        const producto = await ProductoRepo.findById(id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        return res.json(producto);
    } catch (error) {
        console.error("Error en obtener producto por id:", error);
        return res.status(500).json({ error: "Error al obtener el producto" });
    }
};

// Registrar nuevo producto
export const addProducto = async (req, res) => {
    try {
        const { nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo } = req.body;
        const nuevoProducto = await ProductoRepo.insertProducto(nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo);
        res.status(201).json({
            message: "Producto insertado exitosamente",
            producto: nuevoProducto,
        });
    } catch (error) {
        console.error("Error al insertar producto:", error);
        res.status(500).json({ error: "Error al insertar el producto" });
    }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
    try {
        const { idproducto, nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, stockMinimo, porcentajeDescuento = 0 } = req.body;

        const actualizarProducto = await ProductoRepo.updateProducto(idproducto, nombre, marca, descripcion, precio, stock, fechaIngreso, ubicacionAlmacen, proveedor, categoria, vehiculosCompatibles, tipo, img, parseFloat(porcentajeDescuento) / 100, stockMinimo);
        res.status(201).json({
            message: "Producto actualizado exitosamente",
            producto: actualizarProducto,
        });
    } catch (error) {
        console.error("Controller - Error al actualizar producto:", error);
        res.status(500).json({ error: "Controller - Error al actualizar el producto" });
    }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Parámetro
        const producto = await ProductoRepo.findById(id);
        if (!producto) {
            res.status(404).json({ error: "Controller - Producto no encontrado" });
        }
        await ProductoRepo.deleteProducto(id);
        res.status(200).json({ message: "Controller - Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Controller - Error al eliminar producto:", error);
        res.status(500).json({ error: "Controller - Error al eliminar el producto" });
    }
};

export const getMinMax = async (_req, res) => {
    try {
        const producto = await ProductoRepo.getMinMax();
        if (!producto) {
            return res.status(404).json({ error: "No se encontraron datos de precios" });
        }
        res.json(producto[0]);
    } catch (error) {
        console.error("Error en getMinMax:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
