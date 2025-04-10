import { getConnection, sql } from '../../config/db.js';

export async function obtenerClientes() {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM CLIENTES');
  return result.recordset;
}

export async function insertarCliente(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('nombre', sql.VarChar, data.nombre)
    .input('correo', sql.VarChar, data.correo)
    .input('telefono', sql.VarChar, data.telefono)
    .input('direccion', sql.VarChar, data.direccion)
    .input('estado', sql.Bit, true)
    .query(`
      INSERT INTO CLIENTES (nombre, correo, telefono, direccion, estado)
      OUTPUT INSERTED.idCliente
      VALUES (@nombre, @correo, @telefono, @direccion, @estado)
    `);
  return result.recordset[0].idCliente;
}

export async function modificarCliente(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('nombre', sql.VarChar, data.nombre)
    .input('correo', sql.VarChar, data.correo)
    .input('telefono', sql.VarChar, data.telefono)
    .input('direccion', sql.VarChar, data.direccion)
    .query(`
      UPDATE CLIENTES
      SET nombre = @nombre,
          correo = @correo,
          telefono = @telefono,
          direccion = @direccion
      WHERE idCliente = @id
    `);
}

export async function eliminarClientePorId(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM CLIENTES WHERE idCliente = @id');
}
