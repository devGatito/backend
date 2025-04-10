
import db from "../../config/db.js";
import crypto from "crypto";

export const generarTokenRecuperacion = async (correo) => {
  const token = crypto.randomBytes(32).toString("hex");
  const fechaExpiracion = new Date(Date.now() + 3600000); // 1 hora de expiración

  await db.query(`
    INSERT INTO RECUPERACION_CONTRASEÑA (correo, token, expiracion) 
    VALUES (@correo, @token, @expiracion)
  `, { correo, token, expiracion: fechaExpiracion });

  return token;
};

export const validarTokenRecuperacion = async (token) => {
  const result = await db.query(`
    SELECT * FROM RECUPERACION_CONTRASEÑA WHERE token = @token
  `, { token });

  if (result.recordset.length === 0) return null;

  const { correo, expiracion } = result.recordset[0];
  if (new Date(expiracion) < new Date()) {
    await db.query(`
      DELETE FROM RECUPERACION_CONTRASEÑA WHERE token = @token
    `, { token });
    return null; // Token expirado
  }

  return correo;
};

export const eliminarTokenRecuperacion = async (token) => {
  await db.query(`
    DELETE FROM RECUPERACION_CONTRASEÑA WHERE token = @token
  `, { token });
};
