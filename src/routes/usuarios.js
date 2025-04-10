import express from 'express';
import { crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario } from '../controllers/usuarios.controller.js';

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/', obtenerUsuarios);

// Ruta para actualizar un usuario por ID
router.put('/:id', actualizarUsuario);

// Ruta para eliminar un usuario por ID
router.delete('/:id', eliminarUsuario);

export default router;
