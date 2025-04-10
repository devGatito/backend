import { getConnection, sql } from '../../config/db.js';

export async function obtenerTrabajadores() {
  const pool = await getConnection();
  const result = await pool.request().query('SELECT * FROM TRABAJADORES');
  return result.recordset;
}

export async function insertarTrabajador(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('nombre', sql.VarChar, data.nombre)
    .input('puesto', sql.VarChar, data.puesto)
    .input('telefono', sql.VarChar, data.telefono)
    .input('estado', sql.Bit, true)
    .query(`
      INSERT INTO TRABAJADORES (nombre, puesto, telefono, estado)
      OUTPUT INSERTED.idTrabajador
      VALUES (@nombre, @puesto, @telefono, @estado)
    `);
  return result.recordset[0].idTrabajador;
}

export async function modificarTrabajador(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('nombre', sql.VarChar, data.nombre)
    .input('puesto', sql.VarChar, data.puesto)
    .input('telefono', sql.VarChar, data.telefono)
    .query(`
      UPDATE TRABAJADORES
      SET nombre = @nombre,
          puesto = @puesto,
          telefono = @telefono
      WHERE idTrabajador = @id
    `);
}

export async function eliminarTrabajadorPorId(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM TRABAJADORES WHERE idTrabajador = @id');
}
