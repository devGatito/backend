import { getConnection, sql } from '../../config/db.js';

export async function obtenerProductos() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT * FROM PRODUCTOS
  `);
  return result.recordset;
}

export async function insertarProducto(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('nombre', sql.VarChar, data.nombre)
    .input('descripcion', sql.VarChar, data.descripcion)
    .input('tipo', sql.VarChar, data.tipo)
    .input('precio', sql.Decimal(10, 2), data.precio)
    .input('stock', sql.Int, data.stock || 0)
    .input('estado', sql.Bit, true)
    .query(`
      INSERT INTO PRODUCTOS (nombre, descripcion, tipo, precio, stock, estado)
      OUTPUT INSERTED.idProducto
      VALUES (@nombre, @descripcion, @tipo, @precio, @stock, @estado)
    `);
  return result.recordset[0].idProducto;
}

export async function modificarProducto(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('nombre', sql.VarChar, data.nombre)
    .input('descripcion', sql.VarChar, data.descripcion)
    .input('tipo', sql.VarChar, data.tipo)
    .input('precio', sql.Decimal(10, 2), data.precio)
    .input('stock', sql.Int, data.stock)
    .query(`
      UPDATE PRODUCTOS
      SET nombre = @nombre,
          descripcion = @descripcion,
          tipo = @tipo,
          precio = @precio,
          stock = @stock
      WHERE idProducto = @id
    `);
}

export async function eliminarProductoPorId(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM PRODUCTOS WHERE idProducto = @id');
}
