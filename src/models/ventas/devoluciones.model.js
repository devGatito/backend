import { getConnection, sql } from '../../config/db.js';

export async function insertarDevolucion(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idVenta', sql.Int, data.idVenta)
    .input('motivo', sql.VarChar, data.motivo)
    .input('cantidad', sql.Int, data.cantidad)
    .input('total', sql.Decimal(10, 2), data.total)
    .query(`
      INSERT INTO DEVOLUCIONES (idVenta, motivo, cantidad, total)
      OUTPUT INSERTED.idDevolucion
      VALUES (@idVenta, @motivo, @cantidad, @total)
    `);
  return result.recordset[0].idDevolucion;
}

export async function obtenerDevoluciones() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT * FROM DEVOLUCIONES
  `);
  return result.recordset;
}

export async function obtenerDevolucion(id) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT * FROM DEVOLUCIONES WHERE idDevolucion = @id
    `);
  return result.recordset[0];
}
