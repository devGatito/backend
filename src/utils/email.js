// src/utils/email.js
import nodemailer from 'nodemailer';

// Configuración de tu transporte (dependiendo del proveedor de correo)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ejemplo usando Gmail
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASS, // La contraseña de tu correo o una contraseña de app (si usas Gmail)
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,  // El correo desde el que se enviará
      to,                            // Correo de destino
      subject,                       // Asunto del correo
      text,                          // Cuerpo del correo
    });
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};
