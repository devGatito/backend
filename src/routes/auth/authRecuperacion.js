// src/routes/auth.js
import express from "express";
import { solicitarRecuperacion, restablecerContraseña } from "../../controllers/auth/recuperacionController.js";

const router = express.Router();

router.post("/solicitar-recuperacion", solicitarRecuperacion);
router.post("/restablecer-contraseña", restablecerContraseña);

export default router;
