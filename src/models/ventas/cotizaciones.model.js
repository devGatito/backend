import { getConnection, sql } from '../../config/db.js';

export async function insertarCotizacion(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idCliente', sql.Int, data.idCliente)
    .input('total', sql.Decimal(10, 2), data.total)
    .input('estado', sql.VarChar, data.estado || 'PENDIENTE')
    .query(`
      INSERT INTO COTIZACIONES (idCliente, total, estado)
      OUTPUT INSERTED.idCotizacion
      VALUES (@idCliente, @total, @estado)
    `);
  return result.recordset[0].idCotizacion;
}

export async function obtenerCotizaciones() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT * FROM COTIZACIONES
  `);
  return result.recordset;
}

export async function obtenerCotizacion(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT * FROM COTIZACIONES WHERE idCotizacion = @id
    `);
  return result.recordset[0];
}

export async function actualizarEstadoCotizacion(id, estado) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('estado', sql.VarChar, estado)
    .query(`
      UPDATE COTIZACIONES
      SET estado = @estado
      WHERE idCotizacion = @id
    `);
}
