import sql from "mssql";
import { getConnection } from "../../config/db.js";

export class Marca {
  constructor(idMarca, nombreMarca) {
    this.idMarca = idMarca;
    this.nombreMarca = nombreMarca;
  }
}

export class MarcaRepository {
  // Obtener todas las marcas
  async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query("SELECT * FROM MARCA_PRODUCTO");
      return result.recordset;
    } catch (error) {
      console.error("Error en getAll:", error);
      throw new Error("Error al obtener categorías");
    }
  }

  // Buscar marca por ID
  async findById(idMarca) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("idMarca", sql.Int, idMarca)
        .query("SELECT * FROM MARCA_PRODUCTO WHERE idMarca = @idMarca");

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error en findById:", error);
      throw new Error("Error al obtener marca por ID");
    }
  }
}
