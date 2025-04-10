import sql from 'mssql';
import { getConnection } from '../../config/db.js';

export class Notificaciones {
    constructor(idNotificacion, titulo, cuerpo, fecha, modulo, tipo, estado) {
        this.idNotificacion = idNotificacion;
        this.titulo = titulo;
        this.cuerpo = cuerpo;
        this.fecha = fecha;
        this.modulo = modulo;
        this.tipo = tipo;
        this.estado = estado;
    }
}

export class NotificacionesRepository {
    async getNotificaciones(modulo) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('modulo', sql.VarChar, modulo)
                .query(`SELECT * FROM NOTIFICACIONES WHERE modulo = @modulo`);
            return result.recordset;
        } catch (error) {
            console.error('M-Error al obtener notificaciones:', error);
            throw new Error('M-Error al obtener notificaciones:');
        }
    }

    async EliminarNotificacion(idNotificacion) {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .input('idNotificacion', sql.BigInt, idNotificacion)
                .query(`DELETE FROM NOTIFICACIONES WHERE idNotificacion = @idNotificacion`);
            return result.recordset;
        } catch (error) {
            console.error('M-Error al eliminar notificacion:', error);
            throw new Error('M-Error al eliminar notificacion:');
        }
    }
}
