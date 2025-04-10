import { getConnection, sql } from '../../config/db.js';

export async function obtenerVehiculos() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT V.*, C.nombre AS cliente
    FROM VEHICULOS V
    JOIN CLIENTES C ON V.idCliente = C.idCliente
  `);
  return result.recordset;
}

export async function insertarVehiculo(data) {
  const pool = await getConnection();
  const result = await pool.request()
    .input('idCliente', sql.Int, data.idCliente)
    .input('marca', sql.VarChar, data.marca)
    .input('modelo', sql.VarChar, data.modelo)
    .input('anio', sql.Int, data.anio)
    .input('placas', sql.VarChar, data.placas)
    .input('color', sql.VarChar, data.color)
    .input('estado', sql.Bit, true)
    .query(`
      INSERT INTO VEHICULOS (idCliente, marca, modelo, anio, placas, color, estado)
      OUTPUT INSERTED.idVehiculo
      VALUES (@idCliente, @marca, @modelo, @anio, @placas, @color, @estado)
    `);
  return result.recordset[0].idVehiculo;
}

export async function modificarVehiculo(id, data) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .input('marca', sql.VarChar, data.marca)
    .input('modelo', sql.VarChar, data.modelo)
    .input('anio', sql.Int, data.anio)
    .input('placas', sql.VarChar, data.placas)
    .input('color', sql.VarChar, data.color)
    .query(`
      UPDATE VEHICULOS
      SET marca = @marca,
          modelo = @modelo,
          anio = @anio,
          placas = @placas,
          color = @color
      WHERE idVehiculo = @id
    `);
}

export async function eliminarVehiculoPorId(id) {
  const pool = await getConnection();
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM VEHICULOS WHERE idVehiculo = @id');
}
