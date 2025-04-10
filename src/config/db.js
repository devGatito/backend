import sql from 'mssql';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000
  }
};

// Crear pool de conexiones
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Eventos para manejo de errores
pool.on('error', err => {
  console.error('❌ Error en el pool de conexiones:', err.message);
});

export async function getConnection() {
  try {
    if (!pool.connected) {
      await poolConnect;
    }

    // ✅ Log para saber a qué base de datos te estás conectando
    const dbCheck = await pool.request().query('SELECT DB_NAME() AS dbname');
    console.log('📌 Base de datos conectada:', dbCheck.recordset[0].dbname);

    const testResult = await pool.request().query('SELECT 1 AS test');
    if (!testResult.recordset[0].test === 1) {
      throw new Error('La conexión no está respondiendo correctamente');
    }

    return pool;
  } catch (err) {
    console.error('Error al obtener conexión:', err);

    try {
      await pool.close();
      await pool.connect();
      console.log('✅ Reconexión exitosa');
      return pool;
    } catch (reconnectErr) {
      console.error('❌ Error al reconectar:', reconnectErr);
      throw new Error('No se pudo establecer conexión con la base de datos');
    }
  }
}

export async function executeQuery(query, params = {}) {
  const connection = await getConnection();
  const request = connection.request();
  
  Object.entries(params).forEach(([key, value]) => {
    request.input(key, value);
  });
  
  return await request.query(query);
}

export { pool, sql };