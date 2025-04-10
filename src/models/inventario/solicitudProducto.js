import sql from "mssql";
import { getConnection } from "../../config/db.js";

export class SolicitudProducto {
    constructor(idSolicitud, titulo, cuerpo, usuario, fecha) {
        this.idSolicitud = idSolicitud;
        this.titulo = titulo;
        this.cuerpo = cuerpo;
        this.usuario = usuario;
        this.fecha = fecha;
    }
}

export class SolicitudRepository {

    // Obtener todas las solicitudes
    async getAllSolicitud() {
        try {
            const pool = await getConnection(); // Conexion a la base de datos
            const result = await pool
                .request()
                .query("SELECT * FROM INV_REPUESTO_SOLICITUD WHERE aprobado IS NULL"); // Consulta SQL
            return result.recordset;
        } catch (error) {
            // Manejo de errores
            console.error("Error en getAll:", error);
            throw new Error("Error al obtener solicitud", error);
        }
    }

    // Insertar solicitud
    async insertSolicitud(titulo, cuerpo, usuario) {
        try {
            const pool = await getConnection();
            const result = await pool
                // Parametros para la consulta
                .request()
                .input("titulo", sql.VarChar, titulo)
                .input("cuerpo", sql.NVarChar, cuerpo)
                .input("usuario", sql.VarChar, usuario)
                .query(`
                    INSERT INTO INV_REPUESTO_SOLICITUD 
                    (titulo, cuerpo, usuario)
                    VALUES 
                    (@titulo, @cuerpo, @usuario)
                `);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Error en insertar solicitud:", error);
        }
    }

    // Actualizar solicitud
    async updateSolicitud(idSolicitud, aprobado) {
        try {
            const pool = await getConnection();
            const result = await pool
                // Parametros para la actualización
                .request()
                .input("idSolicitud", sql.Int, idSolicitud)
                .input("aprobado", sql.Bit, aprobado)
                .query(`
                    UPDATE INV_REPUESTO_SOLICITUD 
                    SET aprobado = @aprobado
                    WHERE idSolicitud = @idSolicitud
                `);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Error en actualizar solicitud:", error);
        }
    }
}
