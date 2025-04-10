// src/controllers/auth/recuperacionController.js
import { generarTokenRecuperacion, validarTokenRecuperacion, eliminarTokenRecuperacion } from "../../models/auth/recuperacionModel.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/email.js"; // Asumiendo que tienes un servicio de correo

export const solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;
  
  if (!correo) {
    return res.status(400).json({ msg: "Correo es obligatorio." });
  }

  // Verificar que el usuario exista
  const usuario = await findUserByEmail(correo);
  if (!usuario) {
    return res.status(404).json({ msg: "Usuario no encontrado." });
  }

  // Generar el token y enviarlo por correo
  const token = await generarTokenRecuperacion(correo);
  const enlaceRecuperacion = `http://localhost:3000/reset-password?token=${token}`;
  
  // Aquí enviarías el correo con el enlace de recuperación
  await sendEmail(correo, "Recuperación de Contraseña", `Haz clic en este enlace para recuperar tu contraseña: ${enlaceRecuperacion}`);

  res.json({ msg: "Correo de recuperación enviado." });
};

export const restablecerContraseña = async (req, res) => {
  const { token, nuevaContraseña } = req.body;

  if (!token || !nuevaContraseña) {
    return res.status(400).json({ msg: "Token y nueva contraseña son obligatorios." });
  }

  // Validar token
  const correo = await validarTokenRecuperacion(token);
  if (!correo) {
    return res.status(400).json({ msg: "Token inválido o expirado." });
  }

  // Hashear la nueva contraseña
  const nuevaContraseñaHasheada = await bcrypt.hash(nuevaContraseña, 10);

  // Actualizar la contraseña del usuario
  await db.query(`
    UPDATE USUARIOS SET contraseña = @nuevaContraseña WHERE correo = @correo
  `, { correo, nuevaContraseña: nuevaContraseñaHasheada });

  // Eliminar el token después de usarlo
  await eliminarTokenRecuperacion(token);

  res.json({ msg: "Contraseña restablecida exitosamente." });
};
