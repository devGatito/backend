// src/middleware/authorizeRole.js
export const authorizeRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { rol } = req.user; // Suponiendo que el usuario está en req.user después de authenticateJWT
  
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ msg: "No tienes permisos suficientes." });
    }
  
    next();
  };
};
