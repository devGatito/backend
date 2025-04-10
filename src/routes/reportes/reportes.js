import express from 'express';
import { generarReporteClientes, generarReporteVentas, generarReporteHorasMecanico, exportarReporte } from '../../controllers/reportes/reportesController.js';

const router = express.Router();

router.get('/clientes', generarReporteClientes);
router.get('/ventas', generarReporteVentas);
router.get('/horas-mecanico', generarReporteHorasMecanico);
router.get('/exportar', exportarReporte);

export default router;
