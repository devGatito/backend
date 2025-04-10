import { executeQuery } from '../../config/db.js';
import bcrypt from 'bcrypt';

export const crearPrimerAdmin = async (req, res) => {
  const { nombre, email, cedula, contrasena } = req.body;

  try {
    // 1. Verificar si ya existe un admin
    const adminCheck = await executeQuery(
      "SELECT COUNT(*) AS count FROM USUARIO WHERE rol = 'ADMIN'"
    );
    
    if (adminCheck.recordset[0].count > 0) {
      return res.status(400).json({ msg: "Ya existe un administrador" });
    }

    // 2. Crear hash de contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // 3. Insertar nuevo admin
    await executeQuery(`
      INSERT INTO USUARIO 
      (nombreUsuario, email, cedula, contrasenaHash, estadoCuenta, intentosFallidos, fechaRegistro, rol) 
      VALUES (@nombre, @email, @cedula, @contrasenaHash, 1, 0, GETDATE(), 'ADMIN')
    `, {
      nombre: { type: sql.NVarChar(50), value: nombre },
      email: { type: sql.NVarChar(100), value: email },
      cedula: { type: sql.NVarChar(10), value: cedula },
      contrasenaHash: { type: sql.VarBinary(sql.MAX), value: Buffer.from(contrasenaHash) }
    });

    res.json({ msg: "Administrador creado exitosamente" });
  } catch (err) {
    console.error('Error en crearPrimerAdmin:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      msg: 'Error al crear administrador',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};