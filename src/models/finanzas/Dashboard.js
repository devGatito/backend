import sql from 'mssql';
import { getConnection } from '../../config/db.js';

export class DashboardRepository {

    async getGanaciaMes() {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .execute(`SP_GET_GANANCIAS_MESES`);
            return result.recordset[0];
        } catch (error) {
            console.error('Error en obtener datos', error);
            throw new Error('Error en obtener datos');
        }
    }

    async getGastoMes() {
        try {
            const pool = await getConnection();
            const result = await pool
                .request()
                .execute(`SP_GET_GASTOS_MESES`);
            return result.recordset[0];
        } catch (error) {
            console.error('Error en obtener datos', error);
            throw new Error('Error en obtener datos');
        }
    }

}