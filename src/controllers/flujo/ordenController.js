import { OrdenRepository } from '../../models/flujo/orden.js';
import { pool, executeQuery } from '../../config/db.js';
import sql from 'mssql';
import config from '../../../config.js';
import { NotificacionService } from '../../services/notificacionService.js';
import { InventarioService } from '../../services/inventarioService.js';
import { FinanzaService } from '../../services/finanzaService.js';

const notificacionService = new NotificacionService();
const inventarioService = new InventarioService();
const finanzaService = new FinanzaService();

// Crear una instancia de ordenRepository
const OrdenRepo = new OrdenRepository();

//insertar nueva orden
const insertOrden = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { tiempoEstimado, idVehiculo, idTrabajador, idCliente, descripcion } = req.body;

        // Usar el método de inserción del repositorio
        const orden = await OrdenRepo.insertOrden(tiempoEstimado, idVehiculo, idTrabajador, idCliente, descripcion);

        // Enviar la respuesta
        res.status(201).json({ message: "Orden insertado correctamente", rowsAffected: orden });
    } catch (error) {
        console.error("Error al insertar orden:", error);
        res.status(500).json({ error: "Error al insertar orden" });
    }
};

//Listar por columna
const getOrdenesByStatus = async (req, res) => {
    try {

        const id = parseInt(req.params.id);

        // Usar el método de listado del repositorio
        const orden = await OrdenRepo.getOrdenesByStatus(id);

        // Enviar la respuesta
        res.status(200).json(orden);
    } catch (error) {
        console.error("Error al obtener orden:", error);
        res.status(500).json({ error: "Error al obtener orden" });
    }
};

//obtener por ID (preload detalles y editar)
const getOrdenById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Usar el método de obtener orden por ID
        const orden = await OrdenRepo.getOrdenById(id);

        // Enviar la respuesta
        res.status(200).json(orden);
    } catch (error) {
        console.error("Error al obtener orden", error);
        res.status(500).json({ error: "Error al obtener orden" });
    }
};

//pasar a la siguiente fase // cancelar orden
const siguienteFase = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idOrden, estadoOrden } = req.body;

        // Usar el método de actualizar del repositorio
        const orden = await OrdenRepo.siguienteFase(idOrden, estadoOrden + 1);

        // Enviar la respuesta
        res.status(200).json({ message: "Orden actualizado correctamente", rowsAffected: orden });
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        res.status(500).json({ error: "Error al actualizar orden" });
    }
};

const updateOrden = async (req, res) => {
    try {
        // Requerir parámetros desde el cuerpo de la solicitud
        const { idOrden, tiempoEstimado, idTrabajador, idVehiculo, descripcion, estadoAtrasado } = req.body;

        // Usar el método de actualizar del repositorio
        const orden = await OrdenRepo.updateOrden(idOrden, tiempoEstimado, idTrabajador, idVehiculo, descripcion, estadoAtrasado);

        // Enviar la respuesta
        res.status(200).json({ message: "Orden actualizado correctamente", rowsAffected: orden });
    } catch (error) {
        console.error("Error al actualizar orden:", error);
        res.status(500).json({ error: "Error al actualizar orden" });
    }
};

const crearOrden = async (req, res) => {
  // Validar límite de órdenes activas
  const ordenesActivas = await executeQuery(`
    SELECT COUNT(*) as count FROM ORDEN 
    WHERE estado IN ('PENDIENTE', 'EN_PROCESO')
  `);

  if (ordenesActivas.recordset[0].count >= config.modules.workflow.maxActiveOrders) {
    return res.status(400).json({
      success: false,
      message: 'Se ha alcanzado el límite máximo de órdenes activas'
    });
  }
  const { 
    clienteId, 
    vehiculoId, 
    descripcion, 
    productos, // Array de {productoId, cantidad}
    mecanicoId,
    servicios, // Array de servicios requeridos
    prioridad // ALTA, MEDIA, BAJA
  } = req.body;

  const transaction = await pool.transaction();

  try {
    // 1. Verificar existencia del cliente y vehículo
    const clienteResult = await transaction.request()
      .input('clienteId', sql.Int, clienteId)
      .input('vehiculoId', sql.Int, vehiculoId)
      .query(`
        SELECT c.email, c.nombreCliente, v.modelo, v.placa 
        FROM CLIENTE c
        JOIN VEHICULO v ON v.clienteId = c.idCliente
        WHERE c.idCliente = @clienteId AND v.idVehiculo = @vehiculoId
      `);

    if (clienteResult.recordset.length === 0) {
      throw new Error('Cliente o vehículo no encontrado');
    }

    // 2. Verificar disponibilidad de productos
    for (const producto of productos) {
      const stockResult = await transaction.request()
        .input('productoId', sql.Int, producto.productoId)
        .input('cantidad', sql.Int, producto.cantidad)
        .query(`
          SELECT stock, nombre 
          FROM PRODUCTOS 
          WHERE idProducto = @productoId AND stock >= @cantidad
        `);

      if (stockResult.recordset.length === 0) {
        throw new Error(`Stock insuficiente para el producto ${producto.productoId}`);
      }
    }

    // 3. Crear la orden
    const ordenResult = await transaction.request()
      .input('clienteId', sql.Int, clienteId)
      .input('vehiculoId', sql.Int, vehiculoId)
      .input('descripcion', sql.NVarChar(500), descripcion)
      .input('mecanicoId', sql.Int, mecanicoId)
      .input('estado', sql.NVarChar(20), 'PENDIENTE')
      .input('prioridad', sql.NVarChar(20), prioridad)
      .input('fechaCreacion', sql.DateTime, new Date())
      .query(`
        INSERT INTO ORDEN (
          clienteId, vehiculoId, descripcion, mecanicoId,
          estado, prioridad, fechaCreacion
        )
        OUTPUT INSERTED.idOrden
        VALUES (
          @clienteId, @vehiculoId, @descripcion, @mecanicoId,
          @estado, @prioridad, @fechaCreacion
        )
      `);

    const ordenId = ordenResult.recordset[0].idOrden;

    // 4. Registrar productos requeridos y actualizar inventario
    for (const producto of productos) {
      await transaction.request()
        .input('ordenId', sql.Int, ordenId)
        .input('productoId', sql.Int, producto.productoId)
        .input('cantidad', sql.Int, producto.cantidad)
        .query(`
          INSERT INTO ORDEN_PRODUCTOS (ordenId, productoId, cantidad)
          VALUES (@ordenId, @productoId, @cantidad);

          UPDATE PRODUCTOS
          SET stock = stock - @cantidad
          WHERE idProducto = @productoId;
        `);
    }

    // 5. Registrar servicios
    for (const servicio of servicios) {
      await transaction.request()
        .input('ordenId', sql.Int, ordenId)
        .input('servicioId', sql.Int, servicio.servicioId)
        .query(`
          INSERT INTO ORDEN_SERVICIOS (ordenId, servicioId)
          VALUES (@ordenId, @servicioId)
        `);
    }

    // 6. Crear notificación en el sistema
    await transaction.request()
      .input('tipo', sql.NVarChar(50), 'NUEVA_ORDEN')
      .input('mensaje', sql.NVarChar(500), `Nueva orden #${ordenId} creada para el vehículo ${clienteResult.recordset[0].modelo}`)
      .input('destinatarioId', sql.Int, mecanicoId)
      .input('fechaCreacion', sql.DateTime, new Date())
      .query(`
        INSERT INTO NOTIFICACIONES (
          tipo, mensaje, destinatarioId, fechaCreacion, leida
        )
        VALUES (
          @tipo, @mensaje, @destinatarioId, @fechaCreacion, 0
        )
      `);

    // Verificar stock de productos
    for (const producto of productos) {
      const stockBajo = await inventarioService.verificarStockBajo(producto.productoId, producto.cantidad);
      if (stockBajo) {
        await notificacionService.notificarStockBajo(producto.productoId);
      }
    }

    // Crear registro financiero inicial
    await finanzaService.crearRegistroOrden(ordenId, clienteId);

    await transaction.commit();

    // Enviar notificaciones
    await notificacionService.notificarNuevaOrden(ordenId, clienteResult.recordset[0]);

    // 7. Enviar respuesta
    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        ordenId,
        cliente: clienteResult.recordset[0],
        estado: 'PENDIENTE',
        fechaCreacion: new Date()
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en crearOrden:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear la orden',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

const actualizarEstadoOrden = async (req, res) => {
  // Validar estado según configuración
  if (!config.modules.workflow.statuses.includes(nuevoEstado)) {
    return res.status(400).json({
      success: false,
      message: 'Estado no válido según la configuración del sistema'
    });
  }
  const { ordenId } = req.params;
  const { nuevoEstado, comentario } = req.body;

  const estadosValidos = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];
  
  if (!estadosValidos.includes(nuevoEstado)) {
    return res.status(400).json({
      success: false,
      message: 'Estado no válido'
    });
  }

  const transaction = await pool.transaction();

  try {
    // 1. Obtener información actual de la orden
    const ordenResult = await transaction.request()
      .input('ordenId', sql.Int, ordenId)
      .query(`
        SELECT o.*, c.email, c.nombreCliente, v.modelo, v.placa
        FROM ORDEN o
        JOIN CLIENTE c ON o.clienteId = c.idCliente
        JOIN VEHICULO v ON o.vehiculoId = v.idVehiculo
        WHERE o.idOrden = @ordenId
      `);

    if (ordenResult.recordset.length === 0) {
      throw new Error('Orden no encontrada');
    }

    const orden = ordenResult.recordset[0];

    // 2. Actualizar estado
    await transaction.request()
      .input('ordenId', sql.Int, ordenId)
      .input('estado', sql.NVarChar(20), nuevoEstado)
      .input('fechaActualizacion', sql.DateTime, new Date())
      .query(`
        UPDATE ORDEN
        SET estado = @estado,
            fechaActualizacion = @fechaActualizacion
        WHERE idOrden = @ordenId
      `);

    // 3. Registrar el cambio en el historial
    await transaction.request()
      .input('ordenId', sql.Int, ordenId)
      .input('estadoAnterior', sql.NVarChar(20), orden.estado)
      .input('estadoNuevo', sql.NVarChar(20), nuevoEstado)
      .input('comentario', sql.NVarChar(500), comentario)
      .input('usuarioId', sql.Int, req.user.id)
      .input('fecha', sql.DateTime, new Date())
      .query(`
        INSERT INTO ORDEN_HISTORIAL (
          ordenId, estadoAnterior, estadoNuevo,
          comentario, usuarioId, fecha
        )
        VALUES (
          @ordenId, @estadoAnterior, @estadoNuevo,
          @comentario, @usuarioId, @fecha
        )
      `);

    // 4. Crear notificación
    await transaction.request()
      .input('tipo', sql.NVarChar(50), 'ACTUALIZACION_ORDEN')
      .input('mensaje', sql.NVarChar(500), `Orden #${ordenId} actualizada a estado: ${nuevoEstado}`)
      .input('destinatarioId', sql.Int, orden.clienteId)
      .input('fechaCreacion', sql.DateTime, new Date())
      .query(`
        INSERT INTO NOTIFICACIONES (
          tipo, mensaje, destinatarioId, fechaCreacion, leida
        )
        VALUES (
          @tipo, @mensaje, @destinatarioId, @fechaCreacion, 0
        )
      `);

    // Actualizar finanzas si la orden se completa
    if (nuevoEstado === 'COMPLETADO') {
      await finanzaService.finalizarOrden(ordenId);
    }

    // Liberar productos reservados si se cancela
    if (nuevoEstado === 'CANCELADO') {
      await inventarioService.liberarProductosOrden(ordenId);
      await finanzaService.cancelarOrden(ordenId);
    }

    await transaction.commit();

    // Notificar cambio de estado
    await notificacionService.notificarCambioEstado(ordenId, nuevoEstado, orden);

    res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente',
      data: {
        ordenId,
        estadoAnterior: orden.estado,
        estadoNuevo: nuevoEstado,
        fechaActualizacion: new Date()
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en actualizarEstadoOrden:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar el estado de la orden'
    });
  }
};

export {
    insertOrden,
    getOrdenesByStatus,
    getOrdenById,
    siguienteFase,
    updateOrden,
    crearOrden,
    actualizarEstadoOrden
  };