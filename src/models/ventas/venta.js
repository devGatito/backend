import { pool, sql } from '../../config/db.js'; 

export class Venta {
    constructor(idVenta, fechaVenta, montoTotal, detalles, idOrden) {
        this.idVenta = idVenta;
        this.fechaVenta = fechaVenta;
        this.montoTotal = montoTotal;
        this.detalles = detalles;
        this.idOrden = idOrden;
    }
}

export class VentaRepository {
    // Método para insertar venta
    async insertVenta(idOrden, detalles) {
        try {
            const result = await pool
                .request()
                .input('idOrden', sql.Int, idOrden)
                .input('detalles', sql.NVarChar(sql.MAX), detalles)
                .execute(`SP_INSERT_VENTA`);
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Error en insertar venta:', error);
            throw new Error('Error en insertar venta: ' + error.message);
        }
    }

    // Obtener listado de ventas
    async getVentas(nombreCliente = null, codigoOrden = null) {
        try {
            const request = pool.request();
            
            if (codigoOrden) {
                request.input('codigoOrden', sql.VarChar(50), codigoOrden);
            }
            if (nombreCliente) {
                request.input('nombreCliente', sql.VarChar(100), nombreCliente);
            }
            
            const result = await request.execute(`SP_GET_VENTAS`);
            return result.recordset;
        } catch (error) {
            console.error('Error en obtener ventas:', error);
            throw new Error('Error en obtener ventas: ' + error.message);
        }
    }

    // Obtener venta por ID
    async getVentaById(idVenta) {
        try {
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .execute(`SP_GET_VENTA`);
            return result.recordset[0] || null;
        } catch (error) {
            console.error('Error en obtener venta:', error);
            throw new Error('Error en obtener venta: ' + error.message);
        }
    }

    // Agregar producto a venta
    async agregarProducto(idVenta, idProducto, cantidad) {
        try {
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .input('idProducto', sql.Int, idProducto)
                .input('cantidad', sql.Int, cantidad)
                .execute('SP_INSERTAR_PRODUCTO_VENTA');
            return result.rowsAffected[0];
        } catch (error) {
            console.error('Error en insertar producto:', error);
            throw new Error('Error en insertar producto: ' + error.message);
        }
    }

    // Obtener productos de venta
    async getProductosVenta(idVenta) {
        try {
            const result = await pool
                .request()
                .input('idVenta', sql.Int, idVenta)
                .execute('SP_GET_PRODUCTOS_VENTA');
            return result.recordset;
        } catch (error) {
            console.error('Error en obtener productos:', error);
            throw new Error('Error en obtener productos: ' + error.message);
        }
    }

    // Eliminar producto de venta
    async deleteProductoVenta(idProductoVenta, idProducto, cantidad) {
        try {
            const result = await pool
                .request()
                .input('idProductoVenta', sql.Int, idProductoVenta)
                .input('idProducto', sql.Int, idProducto)
                .input('cantidad', sql.Int, cantidad)
                .execute(`SP_DELETE_PRODUCTO_VENTA`);
            return result.recordset[0]?.filasAfectadas || 0;
        } catch (error) {
            console.error('Error en eliminar producto:', error);
            throw new Error('Error en eliminar producto: ' + error.message);
        }
    }
}

export default VentaRepository;