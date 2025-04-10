import { pool } from '../config/db.js';  // Importa la conexión a la base de datos
import sql from 'mssql';  // Asegúrate de importar el módulo mssql
import bcrypt from 'bcryptjs';  // Importa bcrypt para cifrar la contraseña

// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
  
    try {
      const result = await pool.request()
        .input('nombre', sql.VarChar, nombre)  // Declara la variable @nombre correctamente
        .input('email', sql.VarChar, email)
        .input('password', sql.VarBinary, Buffer.from(password))  // Convierte la contraseña a varbinary
        .input('rol', sql.VarChar, rol)  // Asigna el rol
        .query('INSERT INTO USUARIOS (nombre_usuario, email, contrasena, rol) OUTPUT INSERTED.idUsuario VALUES (@nombre, @email, @password, @rol)');
      
      const idUsuario = result.recordset[0].idUsuario;
  
      res.status(201).json({ message: 'Usuario creado', id: idUsuario });
    } catch (err) {
      console.error('Error al crear usuario:', err);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  };
  

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM USUARIOS');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Actualizar un usuario
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;

  try {
    // Si la contraseña es proporcionada, cifrarla
    let query = 'UPDATE USUARIOS SET nombre_usuario = @nombre, email = @email, rol = @rol';
    
    // Si la contraseña ha sido proporcionada, incluir la actualización de la contraseña
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', contrasena = @password';
    }

    query += ' WHERE idUsuario = @id';

    const request = pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('email', sql.VarChar, email)
      .input('rol', sql.VarChar, rol)
      .input('id', sql.Int, id);

    // Si la contraseña ha sido proporcionada, incluirla en la solicitud
    if (password) {
      request.input('password', sql.VarBinary, Buffer.from(password));
    }

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM USUARIOS WHERE idUsuario = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
