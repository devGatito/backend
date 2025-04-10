import { getConnection, sql } from '../../config/db.js';

export async function obtenerMovimientos() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT M.*, P.nombre
    FROM MOVIMIENTOS M
    JOIN PRODUCTOS P ON M.idProducto = P.idProducto
    ORDER BY M.fecha DESC
  `);
  return result.recordset;
}

export async function insertarMovimiento(data) {
  const pool = await getConnection();

  // Actualizar stock según tipo
  const signo = data.tipo === 'ENTRADA' ? '+' : '-';

  await pool.request()
    .input('cantidad', sql.Int, data.cantidad)
    .input('idProducto', sql.Int, data.idProducto)
    .query(`
      UPDATE PRODUCTOS
      SET stock = stock ${signo} @cantidad
      WHERE idProducto = @idProducto
    `);

  const result = await pool.request()
    .input('idProducto', sql.Int, data.idProducto)
    .input('tipo', sql.VarChar, data.tipo)
    .input('cantidad', sql.Int, data.cantidad)
    .input('observacion', sql.VarChar, data.observacion)
    .query(`
      INSERT INTO MOVIMIENTOS (idProducto, tipo, cantidad, observacion)
      OUTPUT INSERTED.idMovimiento
      VALUES (@idProducto, @tipo, @cantidad, @observacion)
    `);

  return result.recordset[0].idMovimiento;
}

export async function obtenerMovimientosPorProducto(idProducto) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idProducto', sql.Int, idProducto)
    .query(`
      SELECT * FROM MOVIMIENTOS
      WHERE idProducto = @idProducto
      ORDER BY fecha DESC
    `);
  return result.recordset;
}
