import { getConnection, sql } from '../../config/db.js';

export async function insertarVenta(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idCliente', sql.Int, data.idCliente)
    .input('idCotizacion', sql.Int, data.idCotizacion)
    .input('total', sql.Decimal(10, 2), data.total)
    .input('estado', sql.VarChar, data.estado || 'PENDIENTE')
    .query(`
      INSERT INTO VENTAS (idCliente, idCotizacion, total, estado)
      OUTPUT INSERTED.idVenta
      VALUES (@idCliente, @idCotizacion, @total, @estado)
    `);
  return result.recordset[0].idVenta;
}

export async function obtenerVentas() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT * FROM VENTAS
  `);
  return result.recordset;
}

export async function obtenerVenta(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT * FROM VENTAS WHERE idVenta = @id
    `);
  return result.recordset[0];
}
