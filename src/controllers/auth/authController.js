import { pool } from "../../config/db.js";
import sql from "mssql";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '00df45fee6a39a3c33f4b2b7eac41fcb86452ce6249a2ad767a024828c2bbf33';
const SALT_ROUNDS = 10;

const ROLES = {
  ADMIN: {
    level: 4,
    canCreate: ['ADMIN', 'MANAGER', 'USER', 'GUEST']
  },
  MANAGER: {
    level: 3,
    canCreate: ['USER', 'GUEST']
  },
  USER: {
    level: 2,
    canCreate: []
  },
  GUEST: {
    level: 1,
    canCreate: []
  }
};

const checkRolePermissions = (currentRole, targetRole) => {
  if (!ROLES[currentRole] || !ROLES[targetRole]) return false;
  return ROLES[currentRole].canCreate.includes(targetRole);
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.idUsuario,
      email: user.email,
      rol: user.rol,
      nombre: user.nombreUsuario
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ 
      success: false, 
      msg: 'Email y contraseña son requeridos',
      code: 'MISSING_FIELDS'
    });
  }

  try {
    const result = await pool.request()
      .input('email', sql.NVarChar(100), email)
      .query(`
        SELECT 
          idUsuario, 
          email, 
          contrasena,
          rol, 
          estadoCuenta,
          nombreUsuario
        FROM USUARIO 
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ 
        success: false, 
        msg: 'Credenciales inválidas',
        code: 'USER_NOT_FOUND'
      });
    }

    const usuario = result.recordset[0];

    if (!usuario.estadoCuenta) {
      return res.status(403).json({ 
        success: false, 
        msg: 'Cuenta inactiva o bloqueada',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!passwordMatch) {
      await pool.request()
        .input('email', sql.NVarChar(100), email)
        .query(`
          UPDATE USUARIO 
          SET intentosFallidos = ISNULL(intentosFallidos, 0) + 1
          WHERE email = @email
        `);
      return res.status(401).json({ 
        success: false, 
        msg: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: usuario.idUsuario }, JWT_SECRET, { expiresIn: '1h' });

    // Actualizar último acceso
    await pool.request()
      .input('idUsuario', sql.Int, usuario.idUsuario)
      .query(`
        UPDATE USUARIO 
        SET fechaUltimaSesion = GETDATE(), 
            intentosFallidos = 0
        WHERE idUsuario = @idUsuario
      `);

    return res.json({
      success: true,
      token,
      user: {
        id: usuario.idUsuario,
        nombre: usuario.nombreUsuario,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ 
      success: false, 
      msg: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
};

export const registrarUsuario = async (req, res) => {
  const { nombre, email, cedula, contrasena, rol } = req.body;
  
  const errors = [];
  if (!nombre) errors.push('Nombre es requerido');
  if (!email) errors.push('Email es requerido');
  if (!cedula) errors.push('Cédula es requerida');
  if (!contrasena) errors.push('Contraseña es requerida');
  
  let finalRol = 'USER'; // Por defecto, asignamos el rol 'USER'
  const requestingUser = req.user;
  
  // Si se pasa un rol, el administrador puede asignar roles específicos.
  if (rol) {
    // Verificamos si el usuario autenticado tiene permisos para asignar el rol solicitado
    if (!requestingUser) {
      errors.push('Se requiere autenticación para asignar roles');
    } else if (!checkRolePermissions(requestingUser.rol, rol)) {
      errors.push(`No tienes permisos para crear usuarios con rol ${rol}`);
    } else {
      finalRol = rol;  // Si tiene permisos, asignamos el rol solicitado
    }
  }

  // Si existen errores, se devuelven al cliente
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      msg: 'Error de validación',
      errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Iniciamos una transacción para asegurar que todos los pasos se realicen correctamente
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Verificamos si el email ya está registrado
    const checkEmailRequest = new sql.Request(transaction);
    const emailExists = await checkEmailRequest
      .input('emailCheck', sql.NVarChar(100), email)
      .query('SELECT 1 FROM USUARIO WHERE email = @emailCheck');

    if (emailExists.recordset.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        msg: 'El email ya está registrado',
        code: 'EMAIL_EXISTS'
      });
    }

    // Verificamos si es el primer usuario
    const isFirstUser = (await request.query('SELECT COUNT(*) AS count FROM USUARIO')).recordset[0].count === 0;
    const assignedRole = isFirstUser ? 'ADMIN' : finalRol; // Si es el primer usuario, asignamos 'ADMIN'

    // Solo los administradores pueden crear usuarios con rol 'ADMIN'
    if (!isFirstUser && requestingUser.rol !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        msg: 'Solo administradores pueden crear nuevos usuarios con rol ADMIN',
        code: 'UNAUTHORIZED'
      });
    }

    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // Insertamos al nuevo usuario
    const result = await request
      .input('nombreUsuario', sql.VarChar(50), nombre)
      .input('emailUsuario', sql.VarChar(100), email)
      .input('cedulaUsuario', sql.NVarChar(30), cedula)
      .input('contrasenaHash', sql.NVarChar(100), hashedPassword)
      .input('rolUsuario', sql.NVarChar(50), assignedRole)
      .query(`
        INSERT INTO USUARIO (
          nombreUsuario, email, cedula, contrasena,
          estadoCuenta, rol, fechaRegistro, fechaUltimaSesion,
          intentosFallidos
        )
        OUTPUT INSERTED.idUsuario
        VALUES (
          @nombreUsuario, @emailUsuario, @cedulaUsuario, @contrasenaHash,
          1, @rolUsuario, GETDATE(), GETDATE(),
          0
        )
      `);

    const newUserId = result.recordset[0].idUsuario;

    await transaction.commit();

    return res.status(201).json({
      success: true,
      msg: 'Usuario registrado exitosamente',
      userId: newUserId,
      user: { 
        nombre, 
        email, 
        rol: assignedRole,
        isFirstUser 
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      msg: 'Error en el servidor al registrar usuario',
      code: 'REGISTRATION_ERROR'
    });
  }
};


export const verificarSesion = (req, res) => {
  // El middleware authenticateJWT ya verificó el token
  return res.json({
    success: true,
    user: req.user
  });
};

export const cerrarSesion = (req, res) => {
  // Con JWT, el cierre de sesión se maneja del lado del cliente
  // eliminando el token almacenado
  return res.json({ 
    success: true, 
    msg: 'Sesión cerrada correctamente' 
  });
};

export const cambiarPassword = async (req, res) => {
  const { contrasenaActual, nuevaContrasena } = req.body;
  const usuario = req.user; // El middleware authenticateJWT ya verificó el token

  try {
    // Verificar contraseña actual
    const result = await pool.request()
      .input('idUsuario', sql.Int, usuario.id)
      .query('SELECT contrasena FROM USUARIO WHERE idUsuario = @idUsuario');

    if (result.recordset.length === 0) {
      return res.status(404).json({ 
        success: false, 
        msg: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    const passwordMatch = await bcrypt.compare(contrasenaActual, result.recordset[0].contrasena);

    if (!passwordMatch) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Contraseña actual incorrecta',
        code: 'WRONG_PASSWORD'
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS);

    // Actualizar contraseña
    await pool.request()
      .input('idUsuario', sql.Int, usuario.id)
      .input('nuevaContrasena', sql.NVarChar(100), hashedPassword)
      .query('UPDATE USUARIO SET contrasena = @nuevaContrasena WHERE idUsuario = @idUsuario');

    return res.json({ 
      success: true, 
      msg: 'Contraseña actualizada correctamente' 
    });

  } catch (error) {
    console.error('Error en cambiarPassword:', error);
    return res.status(500).json({ 
      success: false, 
      msg: 'Error al cambiar contraseña',
      code: 'SERVER_ERROR'
    });
  }
};