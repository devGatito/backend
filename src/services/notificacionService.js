import { executeQuery } from '../config/db.js';
import config from '../../config.js';
import nodemailer from 'nodemailer';

export class NotificacionService {
  constructor() {
    this.transporter = nodemailer.createTransport(config.notifications.email);
  }

  async notificarNuevaOrden(ordenId, cliente) {
    try {
      // Crear notificación en base de datos
      await executeQuery(`
        INSERT INTO NOTIFICACIONES (tipo, mensaje, destinatarioId, fechaCreacion, leida)
        VALUES ('NUEVA_ORDEN', 'Se ha creado la orden #${ordenId}', @clienteId, GETDATE(), 0)
      `, { clienteId: cliente.idCliente });

      // Enviar email si está habilitado
      if (config.notifications.email.enabled && cliente.email) {
        await this.transporter.sendMail({
          from: config.notifications.email.auth.user,
          to: cliente.email,
          subject: `Nueva Orden de Servicio #${ordenId}`,
          html: `
            <h2>Nueva Orden de Servicio</h2>
            <p>Estimado/a ${cliente.nombreCliente},</p>
            <p>Su orden de servicio #${ordenId} ha sido creada exitosamente.</p>
            <p>Puede seguir el estado de su orden en nuestra plataforma.</p>
          `
        });
      }

      // Enviar SMS si está habilitado
      if (config.notifications.sms.enabled && cliente.telefono) {
        // Implementar lógica de SMS según proveedor configurado
      }
    } catch (error) {
      console.error('Error al enviar notificación de nueva orden:', error);
    }
  }

  async notificarCambioEstado(ordenId, nuevoEstado, orden) {
    try {
      // Crear notificación en base de datos
      await executeQuery(`
        INSERT INTO NOTIFICACIONES (tipo, mensaje, destinatarioId, fechaCreacion, leida)
        VALUES ('CAMBIO_ESTADO', 'La orden #${ordenId} ha cambiado a estado: ${nuevoEstado}', @clienteId, GETDATE(), 0)
      `, { clienteId: orden.clienteId });

      if (config.notifications.email.enabled && orden.email) {
        await this.transporter.sendMail({
          from: config.notifications.email.auth.user,
          to: orden.email,
          subject: `Actualización de Orden #${ordenId}`,
          html: `
            <h2>Actualización de Estado</h2>
            <p>Estimado/a ${orden.nombreCliente},</p>
            <p>Su orden #${ordenId} ha sido actualizada al estado: ${nuevoEstado}</p>
            <p>Vehículo: ${orden.modelo} (${orden.placa})</p>
          `
        });
      }
    } catch (error) {
      console.error('Error al enviar notificación de cambio de estado:', error);
    }
  }

  async notificarStockBajo(productoId) {
    try {
      const producto = await executeQuery(`
        SELECT nombre, stock FROM PRODUCTOS WHERE idProducto = @productoId
      `, { productoId });

      if (producto.recordset.length > 0) {
        await executeQuery(`
          INSERT INTO NOTIFICACIONES (tipo, mensaje, destinatarioId, fechaCreacion, leida)
          VALUES ('STOCK_BAJO', 'Stock bajo para producto: ${producto.recordset[0].nombre}', NULL, GETDATE(), 0)
        `);
      }
    } catch (error) {
      console.error('Error al enviar notificación de stock bajo:', error);
    }
  }
}
