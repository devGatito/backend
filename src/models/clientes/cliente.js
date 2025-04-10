import { getConnection } from "../../config/db.js";
import sql from 'mssql';

export class Cliente {
  constructor({ nombre, apellido, cedula, correo, telefono }) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.cedula = cedula;
    this.correo = correo;
    this.telefono = telefono;
    this.fechaRegistro = new Date();
  }
}

export class ClienteRepository {
  // Validación común para clientes
  static validateCliente(cliente) {
    if (!cliente.cedula || cliente.cedula.length !== 10) {
      throw new Error("La cédula debe tener 10 caracteres");
    }
    if (!cliente.nombre || !cliente.apellido) {
      throw new Error("Nombre y apellido son requeridos");
    }
  }

  // Insertar nuevo cliente
  async create(clienteData) {
    try {
      ClienteRepository.validateCliente(clienteData);
      const cliente = new Cliente(clienteData);
      
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("nombre", sql.VarChar(100), cliente.nombre)
        .input("apellido", sql.VarChar(100), cliente.apellido)
        .input("cedula", sql.VarChar(10), cliente.cedula)
        .input("correo", sql.VarChar(100), cliente.correo)
        .input("telefono", sql.VarChar(50), cliente.telefono)
        .query(`
          INSERT INTO CLIENTE 
          (nombre, apellido, cedula, correo, telefono, fechaRegistro)
          OUTPUT INSERTED.idCliente
          VALUES (@nombre, @apellido, @cedula, @correo, @telefono, GETDATE())
        `);
      
      return { id: result.recordset[0].idCliente, ...cliente };
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw new Error("Error al crear cliente: " + error.message);
    }
  }

  // Actualizar cliente
  async update(cedula, updateData) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar(10), cedula)
        .input("nombre", sql.VarChar(100), updateData.nombre)
        .input("apellido", sql.VarChar(100), updateData.apellido)
        .input("correo", sql.VarChar(100), updateData.correo)
        .input("telefono", sql.VarChar(50), updateData.telefono)
        .query(`
          UPDATE CLIENTE SET
            nombre = @nombre,
            apellido = @apellido,
            correo = @correo,
            telefono = @telefono
          WHERE cedula = @cedula
        `);

      if (result.rowsAffected[0] === 0) {
        throw new Error("Cliente no encontrado");
      }
      
      return this.getByCedula(cedula);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw new Error("Error al actualizar cliente: " + error.message);
    }
  }

  // Eliminar cliente
  async delete(cedula) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar(10), cedula)
        .query("DELETE FROM CLIENTE WHERE cedula = @cedula");

      if (result.rowsAffected[0] === 0) {
        throw new Error("Cliente no encontrado");
      }
      
      return true;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      
      // Verificar si es error de FK constraint
      if (error.message.includes("FK_")) {
        throw new Error("No se puede eliminar, el cliente tiene registros relacionados");
      }
      
      throw new Error("Error al eliminar cliente: " + error.message);
    }
  }

  // Obtener todos los clientes (con paginación)
  async getAll(page = 1, pageSize = 10) {
    try {
      const pool = await getConnection();
      const offset = (page - 1) * pageSize;
      
      const result = await pool
        .request()
        .input("offset", sql.Int, offset)
        .input("pageSize", sql.Int, pageSize)
        .query(`
          SELECT * FROM CLIENTE
          ORDER BY nombre
          OFFSET @offset ROWS
          FETCH NEXT @pageSize ROWS ONLY
        `);
        
      const countResult = await pool
        .request()
        .query("SELECT COUNT(*) AS total FROM CLIENTE");
        
      return {
        data: result.recordset,
        total: countResult.recordset[0].total,
        page,
        pageSize
      };
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  }

  // Obtener cliente por cédula
  async getByCedula(cedula) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("cedula", sql.VarChar(10), cedula)
        .query(`
          SELECT 
            c.*,
            (SELECT COUNT(*) FROM CLIENTE_VEHICULO WHERE idCliente = c.idCliente) AS totalVehiculos,
            (SELECT COUNT(*) FROM ORDEN WHERE idCliente = c.idCliente) AS totalOrdenes
          FROM CLIENTE c
          WHERE c.cedula = @cedula
        `);

      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error al consultar cliente:", error);
      throw new Error("Error al consultar cliente");
    }
  }

  // Buscar clientes por nombre o cédula
  async search(term) {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("term", sql.VarChar(100), `%${term}%`)
        .query(`
          SELECT * FROM CLIENTE
          WHERE nombre LIKE @term 
             OR apellido LIKE @term
             OR cedula LIKE @term
          ORDER BY nombre
          LIMIT 10
        `);
        
      return result.recordset;
    } catch (error) {
      console.error("Error al buscar clientes:", error);
      throw new Error("Error al buscar clientes");
    }
  }
}

