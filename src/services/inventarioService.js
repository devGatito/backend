import { executeQuery } from '../config/db.js';
import config from '../../config.js';

export class InventarioService {
  async verificarStockBajo(productoId, cantidadRequerida) {
    try {
      const result = await executeQuery(`
        SELECT stock, stockMinimo 
        FROM PRODUCTOS 
        WHERE idProducto = @productoId
      `, { productoId });

      if (result.recordset.length > 0) {
        const { stock, stockMinimo } = result.recordset[0];
        const stockRestante = stock - cantidadRequerida;
        
        return stockRestante <= stockMinimo || stockRestante <= config.modules.inventory.lowStockThreshold;
      }
      return false;
    } catch (error) {
      console.error('Error al verificar stock bajo:', error);
      return false;
    }
  }

  async liberarProductosOrden(ordenId) {
    try {
      const productos = await executeQuery(`
        SELECT productoId, cantidad
        FROM ORDEN_PRODUCTOS
        WHERE ordenId = @ordenId
      `, { ordenId });

      for (const producto of productos.recordset) {
        await executeQuery(`
          UPDATE PRODUCTOS
          SET stock = stock + @cantidad
          WHERE idProducto = @productoId
        `, {
          productoId: producto.productoId,
          cantidad: producto.cantidad
        });

        // Verificar si se debe generar orden de compra automática
        if (config.modules.inventory.autoReorderEnabled) {
          await this.verificarReordenAutomatica(producto.productoId);
        }
      }
    } catch (error) {
      console.error('Error al liberar productos de la orden:', error);
      throw error;
    }
  }

  async verificarReordenAutomatica(productoId) {
    try {
      const producto = await executeQuery(`
        SELECT stock, stockMinimo, stockMaximo
        FROM PRODUCTOS
        WHERE idProducto = @productoId
      `, { productoId });

      if (producto.recordset.length > 0) {
        const { stock, stockMinimo, stockMaximo } = producto.recordset[0];
        
        if (stock <= stockMinimo) {
          const cantidadReorden = stockMaximo - stock;
          
          await executeQuery(`
            INSERT INTO SOLICITUDES_COMPRA (
              productoId,
              cantidad,
              estado,
              fechaCreacion,
              automatica
            )
            VALUES (
              @productoId,
              @cantidad,
              'PENDIENTE',
              GETDATE(),
              1
            )
          `, {
            productoId,
            cantidad: cantidadReorden
          });
        }
      }
    } catch (error) {
      console.error('Error al verificar reorden automática:', error);
    }
  }

  async actualizarStock(productoId, cantidad, tipo) {
    try {
      let query = `
        UPDATE PRODUCTOS
        SET stock = stock ${tipo === 'entrada' ? '+' : '-'} @cantidad
        WHERE idProducto = @productoId
      `;

      await executeQuery(query, { productoId, cantidad });

      // Registrar movimiento
      await executeQuery(`
        INSERT INTO MOVIMIENTOS_INVENTARIO (
          productoId,
          tipo,
          cantidad,
          fecha,
          descripcion
        )
        VALUES (
          @productoId,
          @tipo,
          @cantidad,
          GETDATE(),
          @descripcion
        )
      `, {
        productoId,
        tipo,
        cantidad,
        descripcion: `Movimiento ${tipo === 'entrada' ? 'de entrada' : 'de salida'}`
      });
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  }
}
