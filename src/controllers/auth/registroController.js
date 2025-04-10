import { crearUsuario, findUserByEmail } from "../../models/auth/usuarioModel.js";

export const registrarUsuario = async (req, res) => {
  const { nombre, email, cedula, contrasena } = req.body;

  if (!nombre || !email || !cedula || !contrasena) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await findUserByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    // Crear el nuevo usuario
    await crearUsuario(nombre, email, cedula, contrasena);
    res.json({ msg: "Usuario creado exitosamente." });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ msg: 'Error al registrar el usuario.' });
  }
};
