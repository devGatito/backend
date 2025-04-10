import { executeQuery } from '../config/db.js';
import config from '../../config.js';

export class FinanzaService {
  async crearRegistroOrden(ordenId, clienteId) {
    try {
      // Obtener detalles de productos y servicios
      const productos = await executeQuery(`
        SELECT 
          p.precio * op.cantidad as subtotal,
          p.precio,
          op.cantidad
        FROM ORDEN_PRODUCTOS op
        JOIN PRODUCTOS p ON p.idProducto = op.productoId
        WHERE op.ordenId = @ordenId
      `, { ordenId });

      const servicios = await executeQuery(`
        SELECT 
          s.precio as subtotal
        FROM ORDEN_SERVICIOS os
        JOIN SERVICIOS s ON s.idServicio = os.servicioId
        WHERE os.ordenId = @ordenId
      `, { ordenId });

      // Calcular totales
      const subtotalProductos = productos.recordset.reduce((sum, p) => sum + p.subtotal, 0);
      const subtotalServicios = servicios.recordset.reduce((sum, s) => sum + s.subtotal, 0);
      const subtotal = subtotalProductos + subtotalServicios;
      const impuesto = subtotal * config.modules.finance.taxRate;
      const total = subtotal + impuesto;

      // Crear registro financiero
      await executeQuery(`
        INSERT INTO REGISTROS_FINANCIEROS (
          ordenId,
          clienteId,
          subtotal,
          impuesto,
          total,
          estado,
          fechaCreacion
        )
        VALUES (
          @ordenId,
          @clienteId,
          @subtotal,
          @impuesto,
          @total,
          'PENDIENTE',
          GETDATE()
        )
      `, {
        ordenId,
        clienteId,
        subtotal,
        impuesto,
        total
      });

    } catch (error) {
      console.error('Error al crear registro financiero:', error);
      throw error;
    }
  }

  async finalizarOrden(ordenId) {
    try {
      // Actualizar estado del registro financiero
      await executeQuery(`
        UPDATE REGISTROS_FINANCIEROS
        SET estado = 'COMPLETADO',
            fechaActualizacion = GETDATE()
        WHERE ordenId = @ordenId
      `, { ordenId });

      // Registrar en el libro mayor
      const registro = await executeQuery(`
        SELECT * FROM REGISTROS_FINANCIEROS
        WHERE ordenId = @ordenId
      `, { ordenId });

      if (registro.recordset.length > 0) {
        await executeQuery(`
          INSERT INTO LIBRO_MAYOR (
            tipo,
            monto,
            descripcion,
            fecha,
            referencia
          )
          VALUES (
            'INGRESO',
            @monto,
            'Pago por orden de servicio #' + @ordenId,
            GETDATE(),
            'ORDEN-' + @ordenId
          )
        `, {
          ordenId,
          monto: registro.recordset[0].total
        });
      }
    } catch (error) {
      console.error('Error al finalizar orden en finanzas:', error);
      throw error;
    }
  }

  async cancelarOrden(ordenId) {
    try {
      // Actualizar estado del registro financiero
      await executeQuery(`
        UPDATE REGISTROS_FINANCIEROS
        SET estado = 'CANCELADO',
            fechaActualizacion = GETDATE()
        WHERE ordenId = @ordenId
      `, { ordenId });

      // Si hubo pagos parciales, generar nota de crédito
      const pagos = await executeQuery(`
        SELECT SUM(monto) as totalPagado
        FROM PAGOS
        WHERE ordenId = @ordenId
      `, { ordenId });

      if (pagos.recordset[0].totalPagado > 0) {
        await executeQuery(`
          INSERT INTO NOTAS_CREDITO (
            ordenId,
            monto,
            estado,
            fechaCreacion
          )
          VALUES (
            @ordenId,
            @monto,
            'PENDIENTE',
            GETDATE()
          )
        `, {
          ordenId,
          monto: pagos.recordset[0].totalPagado
        });
      }
    } catch (error) {
      console.error('Error al cancelar orden en finanzas:', error);
      throw error;
    }
  }

  async registrarPago(ordenId, monto, metodoPago) {
    try {
      // Validar método de pago
      if (!config.modules.finance.paymentMethods.includes(metodoPago)) {
        throw new Error('Método de pago no válido');
      }

      // Registrar pago
      await executeQuery(`
        INSERT INTO PAGOS (
          ordenId,
          monto,
          metodoPago,
          fecha
        )
        VALUES (
          @ordenId,
          @monto,
          @metodoPago,
          GETDATE()
        )
      `, {
        ordenId,
        monto,
        metodoPago
      });

      // Actualizar saldo en registro financiero
      await executeQuery(`
        UPDATE REGISTROS_FINANCIEROS
        SET saldoPagado = ISNULL(saldoPagado, 0) + @monto,
            fechaUltimoPago = GETDATE()
        WHERE ordenId = @ordenId
      `, {
        ordenId,
        monto
      });

      // Verificar si el pago completa el total
      const registro = await executeQuery(`
        SELECT total, saldoPagado
        FROM REGISTROS_FINANCIEROS
        WHERE ordenId = @ordenId
      `, { ordenId });

      if (registro.recordset[0].saldoPagado >= registro.recordset[0].total) {
        await executeQuery(`
          UPDATE REGISTROS_FINANCIEROS
          SET estado = 'PAGADO',
              fechaActualizacion = GETDATE()
          WHERE ordenId = @ordenId
        `, { ordenId });
      }
    } catch (error) {
      console.error('Error al registrar pago:', error);
      throw error;
    }
  }
}
