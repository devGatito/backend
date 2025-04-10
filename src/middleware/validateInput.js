export const validateLoginInput = (req, res, next) => {
  const { email, contrasena } = req.body;

  // Validar que existan los campos requeridos
  if (!email || !contrasena) {
    return res.status(400).json({
      success: false,
      msg: 'Email y contraseña son requeridos',
      code: 'MISSING_FIELDS',
      errors: {
        email: !email ? 'El email es requerido' : null,
        contrasena: !contrasena ? 'La contraseña es requerida' : null
      }
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      msg: 'Formato de email inválido',
      code: 'INVALID_EMAIL_FORMAT',
      errors: {
        email: 'El formato del email no es válido'
      }
    });
  }

  // Validar longitud mínima de contraseña
  if (contrasena.length < 6) {
    return res.status(400).json({
      success: false,
      msg: 'La contraseña debe tener al menos 6 caracteres',
      code: 'INVALID_PASSWORD_LENGTH',
      errors: {
        contrasena: 'La contraseña debe tener al menos 6 caracteres'
      }
    });
  }

  // Si todo está bien, continuar
  next();
};
