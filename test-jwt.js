// test-jwt.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Genera un token
const payload = { userId: 1, username: 'testuser' };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
console.log('Token generado:', token);

// Verifica el token
jwt.verify(token, JWT_SECRET, (err, decoded) => {
  if (err) {
    console.error('Error al verificar el token:', err);
  } else {
    console.log('Token verificado:', decoded);
  }
});
