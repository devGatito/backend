import express from "express";
import { 
  login,
  registrarUsuario,
  verificarSesion,
  cerrarSesion,
  cambiarPassword,
  
} from "../../controllers/auth/authController.js";
import { authenticateJWT } from "../../middleware/authenticateJWT.js";
import { validateLoginInput } from "../../middleware/validateInput.js";

const router = express.Router();

// Rutas públicas
router.post("/login", validateLoginInput, login);
// Ejemplo de uso en rutas
router.post('/registrar', authenticateJWT, authorizeRole(['ADMIN']), registrarUsuario);

// Rutas protegidas (requieren JWT)
router.get("/verificar-sesion", authenticateJWT, verificarSesion);
router.post("/cerrar-sesion", authenticateJWT, cerrarSesion);
router.post("/cambiar-password", authenticateJWT, cambiarPassword);

export default router; 