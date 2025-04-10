import { autenticarUsuario } from '../../models/administrativo/auth.model.js';
import { generarToken } from '../../services/jwt.js';

export async function login(req, res) {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const result = await autenticarUsuario(usuario, password);
    console.log('🧪 Resultado autenticación:', result);

    if (!result || result.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const user = result[0];
    const token = generarToken({ id: user.idUsuario, rol: user.rol });

    res.json({
      message: 'Inicio de sesión exitoso',
      usuario: user,
      token
    });

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

