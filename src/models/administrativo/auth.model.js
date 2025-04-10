import { getConnection, sql } from '../../config/db.js';

export async function autenticarUsuario(usuario, password) {
  const query = `
    SELECT idUsuario, nombre_usuario, rol, contrasena
    FROM USUARIOS
    WHERE nombre_usuario = @usuario 
      AND contrasena = HASHBYTES('SHA2_256', CAST(@password AS NVARCHAR(100)))
  `;

  const connection = await getConnection();
  const request = connection.request();

  // Asegúrate de que la contraseña se convierta correctamente a varbinary
  request.input('usuario', sql.VarChar, usuario);
  request.input('password', sql.VarChar, password);  // La contraseña proporcionada

  // Ejecutar la consulta y retornar el resultado
  const result = await request.query(query);

  return result.recordset;  // Devuelve el usuario encontrado si la autenticación es exitosa
}
