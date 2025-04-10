export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Obtiene el token del header

  // Depuración: Verifica el valor del token
  console.log('Token recibido:', token);

  if (!token) {
    return res.status(401).json({ msg: 'Acceso no autorizado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Token no válido.' });
    }

    req.user = user;  // Agrega la información del usuario al objeto req
    next();
  });
};
