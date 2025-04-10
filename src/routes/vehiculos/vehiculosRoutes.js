import express from "express";
import * as vehiculoController from "../../controllers/vehiculos/vehiculoController.js";

const router = express.Router();

// CRUD
router.post("/registrar", vehiculoController.insertarVehiculo);
router.put("/editar/:idVehiculo", vehiculoController.actualizarVehiculo);
router.delete("/eliminar/:idVehiculo", vehiculoController.eliminarVehiculo);

// Obtener
router.get("/cliente-vehiculos/:idCliente", vehiculoController.getVehiculosPorCliente);
router.get("/ObtenerVehiculos", vehiculoController.obtenerTodosLosVehiculos);
router.get("/ObtenerVehiculo/:placaVehiculo", vehiculoController.obtenerVehiculoPorPlaca);
router.get("/ObteneridVehiculo/:idVehiculo", vehiculoController.obtenerVehiculoPoridVehiculo);

export default router;
