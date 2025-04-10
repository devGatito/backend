import express from "express";
import clienteController from "../../controllers/clientes/clienteController.js";

const router = express.Router();

// Ruta para obtener todos los clientes (NUEVA)
router.get("/", clienteController.obtenerTodosLosClientes);

// Resto de tus rutas existentes
router.post("/registrar", clienteController.insertCliente);
router.put('/editar/:cedula', clienteController.actualizarCliente);
router.delete('/eliminar/:cedula', clienteController.eliminarCliente);
router.get("/:cedula", clienteController.obtenerClientePorCedula);

export default router;