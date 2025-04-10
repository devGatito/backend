import { pool, sql } from "../../config/db.js";
import bcrypt from "bcrypt";  // Usando import en lugar de require

// Función para crear un usuario
export const crearUsuario = async (nombre, email, cedula, contrasena) => {
  try {
    // Hashear la contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // Usamos el pool para realizar la consulta a la base de datos
    await pool.request()
      .input('nombreUsuario', sql.NVarChar, nombre)  // Cambié 'nombre' por 'nombreUsuario'
      .input('email', sql.NVarChar, email)  // Cambié 'correo' por 'email'
      .input('cedula', sql.NVarChar, cedula)  // Agregué 'cedula' como parámetro
      .input('contrasenaHash', sql.NVarChar, contrasenaHash)  // Cambié 'contraseña' por 'contrasenaHash'
      .query(`
        INSERT INTO USUARIO (nombreUsuario, email, cedula, contrasenaHash, estadoCuenta, intentosFallidos, fechaRegistro, fechaUltimaSesion) 
        VALUES (@nombreUsuario, @email, @cedula, @contrasenaHash, 'ACTIVO', 0, GETDATE(), NULL)
      `);  // Agregué valores por defecto para 'estadoCuenta', 'intentosFallidos', 'fechaRegistro' y 'fechaUltimaSesion'
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    throw err;
  }
};

// Función para buscar un usuario por correo
export const findUserByEmail = async (email) => {
  try {
    const result = await pool.request()
      .input('email', sql.NVarChar, email)  // Cambié 'correo' por 'email'
      .query('SELECT * FROM USUARIO WHERE email = @email');
    return result.recordset[0];  // Devuelve el primer usuario encontrado
  } catch (err) {
    console.error('Error al buscar usuario por email:', err);
    throw err;
  }
};

// Función para actualizar intentos fallidos y bloquear la cuenta si es necesario
export const updateLoginAttempts = async (idUsuario, intentosFallidos, bloqueadoHasta) => {
  try {
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('intentosFallidos', sql.Int, intentosFallidos)
      .input('bloqueadoHasta', sql.DateTime, bloqueadoHasta)
      .query(`
        UPDATE USUARIO
        SET intentosFallidos = @intentosFallidos, bloqueadoHasta = @bloqueadoHasta
        WHERE idUsuario = @idUsuario
      `);
  } catch (err) {
    console.error('Error al actualizar intentos fallidos o bloquear la cuenta:', err);
    throw err;
  }
};
