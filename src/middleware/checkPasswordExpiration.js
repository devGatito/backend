// src/middleware/checkPasswordExpiration.js
import { verificarCambioContraseña } from "../models/auth/usuarioModel.js";

export const checkPasswordExpiration = async (req, res, next) => {
  const { id_usuario } = req.user;
  
  const fechaUltimoCambio = await verificarCambioContraseña(id_usuario);
  const fechaLimite = new Date(fechaUltimoCambio).setDate(fechaUltimoCambio.getDate() + 90);

  if (new Date() > fechaLimite) {
    return res.status(403).json({ msg: "Debes cambiar tu contraseña debido a la política de seguridad." });
  }

  next();
};
