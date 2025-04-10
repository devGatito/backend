import { getConnection } from "../../config/db.js";
import sql from "mssql";

class Vehiculo {
  constructor(placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente) {
    this.idVehiculo = 0;
    this.placaVehiculo = placaVehiculo;
    this.modeloVehiculo = modeloVehiculo;
    this.marcaVehiculo = marcaVehiculo;
    this.annoVehiculo = annoVehiculo;
    this.tipoVehiculo = tipoVehiculo;
    this.idCliente = idCliente;
  }
}

class VehiculoRepository {
  async insert(vehiculo) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input("placaVehiculo", vehiculo.placaVehiculo)
        .input("modeloVehiculo", vehiculo.modeloVehiculo)
        .input("marcaVehiculo", vehiculo.marcaVehiculo)
        .input("annoVehiculo", vehiculo.annoVehiculo)
        .input("tipoVehiculo", vehiculo.tipoVehiculo)
        .input("idCliente", vehiculo.idCliente)
        .query(`
          INSERT INTO CLIENTE_VEHICULO (placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente)
          VALUES (@placaVehiculo, @modeloVehiculo, @marcaVehiculo, @annoVehiculo, @tipoVehiculo, @idCliente)
        `);
    } catch (error) {
      console.error("Error al insertar vehiculo:", error);
      throw new Error("Error al insertar vehiculo");
    }
  }

  async updateVehiculo(idVehiculo, datosActualizados) {
    try {
      const pool = await getConnection();
      const { placaVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo, tipoVehiculo, idCliente } = datosActualizados;

      const result = await pool.request()
        .input("idVehiculo", sql.Int, idVehiculo)
        .input("placaVehiculo", sql.VarChar, placaVehiculo)
        .input("modeloVehiculo", sql.VarChar, modeloVehiculo)
        .input("marcaVehiculo", sql.VarChar, marcaVehiculo)
        .input("annoVehiculo", sql.Int, annoVehiculo)
        .input("tipoVehiculo", sql.VarChar, tipoVehiculo)
        .input("idCliente", sql.Int, idCliente)
        .query(`
          UPDATE CLIENTE_VEHICULO
          SET placaVehiculo = @placaVehiculo, modeloVehiculo = @modeloVehiculo, marcaVehiculo = @marcaVehiculo,
          annoVehiculo = @annoVehiculo, tipoVehiculo = @tipoVehiculo, idCliente = @idCliente
          WHERE idVehiculo = @idVehiculo
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al actualizar el vehiculo:", error);
      throw new Error("Error al actualizar el vehiculo");
    }
  }

  async deleteVehiculo(idVehiculo) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input("idVehiculo", sql.Int, idVehiculo)
        .query(`DELETE FROM CLIENTE_VEHICULO WHERE idVehiculo = @idVehiculo`);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error al eliminar vehiculo:", error);
      throw new Error("Error al eliminar vehiculo");
    }
  }

  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM CLIENTE_VEHICULO");
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener todos los vehiculos:", error);
      throw new Error("Error al obtener vehiculos");
    }
  }

  async getVehiculosPorCliente(idCliente) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input("idCliente", sql.Int, idCliente)
        .query(`SELECT idVehiculo, modeloVehiculo, marcaVehiculo, annoVehiculo FROM CLIENTE_VEHICULO WHERE idCliente = @idCliente`);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener vehiculos del cliente:", error);
      throw new Error("Error al obtener vehiculos");
    }
  }

  async getVehiculosPorIdVehiculo(idVehiculo) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input("idVehiculo", sql.Int, idVehiculo)
        .query(`SELECT * FROM CLIENTE_VEHICULO WHERE idVehiculo = @idVehiculo`);
      return result.recordset;
    } catch (error) {
      console.error("Error al obtener vehiculo:", error);
      throw new Error("Error al obtener vehiculo");
    }
  }

  async getByPlaca(placaVehiculo) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input("placaVehiculo", sql.VarChar(10), placaVehiculo)
        .query("SELECT * FROM CLIENTE_VEHICULO WHERE placaVehiculo = @placaVehiculo");
      return result.recordset;
    } catch (error) {
      console.error("Error al consultar el vehiculo:", error);
      throw new Error("Error al consultar el vehiculo");
    }
  }
}

export { Vehiculo, VehiculoRepository };
