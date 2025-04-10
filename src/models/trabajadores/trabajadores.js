import sql from 'mssql';
import { getConnection } from '../../config/db.js';

export class Trabajador {
  constructor(idTrabajador, nombreCompleto, cedula, salario, seguroSocial) {
    this.idTrabajador = idTrabajador;
    this.nombreCompleto = nombreCompleto;
    this.cedula = cedula;
    this.salario = salario;
    this.seguroSocial = seguroSocial;
  }
}

export class TrabajadorRepository {
  async insertTrabajador(nombreCompleto, cedula, salario, seguroSocial) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('nombreCompleto', sql.VarChar, nombreCompleto)
        .input('cedula', sql.VarChar, cedula)
        .input('salario', sql.Decimal(10, 2), salario)
        .input('seguroSocial', sql.VarChar, seguroSocial)
        .query(`
          INSERT INTO TRABAJADOR (nombreCompleto, cedula, salario, seguroSocial)
          VALUES (@nombreCompleto, @cedula, @salario, @seguroSocial)
        `);
      return result.rowsAffected[0];
    } catch (error) {
      console.error('Error en insertar trabajador:', error);
      throw new Error('Error en insertar trabajador');
    }
  }

  async findOne(cedula) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('cedula', sql.VarChar, cedula)
        .query(`SELECT * FROM TRABAJADOR WHERE cedula = @cedula`);
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error al buscar trabajador:', error);
      throw new Error('Error al buscar trabajador');
    }
  }

  async getTrabajadores(nombreCompleto, cedula, salarioMin, salarioMax) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('nombreCompleto', sql.VarChar, nombreCompleto)
        .input('cedula', sql.VarChar, cedula)
        .input('salarioMin', sql.Decimal(10, 2), salarioMin)
        .input('salarioMax', sql.Decimal(10, 2), salarioMax)
        .query(`SELECT * FROM TRABAJADOR`);
      return result.recordset;
    } catch (error) {
      console.error('Error en obtener trabajadores:', error);
      throw new Error('Error en obtener trabajadores');
    }
  }

  async getTrabajadorById(idTrabajador) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('idTrabajador', sql.Int, idTrabajador)
        .query(`SELECT * FROM TRABAJADOR WHERE idTrabajador = @idTrabajador`);
      return result.recordset;
    } catch (error) {
      console.error('Error en obtener trabajador:', error);
      throw new Error('Error en obtener trabajador');
    }
  }

  async updateTrabajador(idTrabajador, nombreCompleto, cedula, salario, seguroSocial) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('idTrabajador', sql.Int, idTrabajador)
        .input('nombreCompleto', sql.VarChar, nombreCompleto)
        .input('cedula', sql.VarChar, cedula)
        .input('salario', sql.Decimal(10, 2), salario)
        .input('seguroSocial', sql.VarChar, seguroSocial)
        .query(`
          UPDATE TRABAJADOR
          SET nombreCompleto = @nombreCompleto,
              cedula = @cedula,
              salario = @salario,
              seguroSocial = @seguroSocial
          WHERE idTrabajador = @idTrabajador
        `);
      return result.rowsAffected[0];
    } catch (error) {
      console.error('Error en actualizar trabajador:', error);
      throw new Error('Error en actualizar trabajador');
    }
  }

  async deleteTrabajador(idTrabajador) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('idTrabajador', sql.Int, idTrabajador)
        .query(`DELETE FROM TRABAJADOR WHERE idTrabajador = @idTrabajador`);
      return result.rowsAffected[0];
    } catch (error) {
      console.error('Error en eliminar trabajador:', error);
      throw new Error('Error en eliminar trabajador');
    }
  }
}
