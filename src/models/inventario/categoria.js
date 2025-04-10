"use strict";

import mssql from "mssql";
import { getConnection } from "../../config/db.js";

export class Categoria {
    constructor(idCategoria, nombreCategoria) {
        this.idCategoria = idCategoria;
        this.nombreCategoria = nombreCategoria;
    }
}

export class CategoriaRepository {
    // Obtener todas las categorias
    async getAll() {
        try {
            const pool = await getConnection();
            const result = await pool.request().query("SELECT * FROM categoria");
            return result.recordset;
        } catch (error) {
            console.error("Error en getAll:", error);
            throw new Error("Error al obtener categorías");
        }
    }

    // Obtener categoria por ID
    async findById(idCategoria) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input("idCategoria", mssql.Int, idCategoria) // Parámetros
                .query("SELECT * FROM categoria WHERE idCategoria = @idCategoria");
            return result.recordset.length > 0 ? result.recordset[0] : null;
        } catch (error) {
            console.error("Error en findById:", error);
            throw new Error("Error al obtener categoría por ID");
        }
    }
}
