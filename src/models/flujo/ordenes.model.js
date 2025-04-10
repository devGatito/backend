import { getConnection, sql } from '../../config/db.js';

export async function obtenerOrdenes() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT O.*, V.placas, C.nombre AS cliente
    FROM ORDENES O
    JOIN VEHICULOS V ON O.idVehiculo = V.idVehiculo
    JOIN CLIENTES C ON V.idCliente = C.idCliente
  `);
  return result.recordset;
}

export async function crearNuevaOrden(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idVehiculo', sql.Int, data.idVehiculo)
    .input('descripcion', sql.VarChar, data.descripcion)
    .input('estado', sql.VarChar, data.estado || 'RECEPCION')
    .query(`
      INSERT INTO ORDENES (idVehiculo, descripcion, estado)
      OUTPUT INSERTED.idOrden
      VALUES (@idVehiculo, @descripcion, @estado)
    `);
  return result.recordset[0].idOrden;
}

export async function obtenerOrden(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT O.*, V.placas, C.nombre AS cliente
      FROM ORDENES O
      JOIN VEHICULOS V ON O.idVehiculo = V.idVehiculo
      JOIN CLIENTES C ON V.idCliente = C.idCliente
      WHERE idOrden = @id
    `);
  return result.recordset[0];
}

export async function actualizarEstado(id, estado) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('estado', sql.VarChar, estado)
    .query(`
      UPDATE ORDENES
      SET estado = @estado
      WHERE idOrden = @id
    `);
}

export async function eliminarOrdenPorId(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM ORDENES WHERE idOrden = @id');
}
