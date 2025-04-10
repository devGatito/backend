import { Router } from 'express';
import { crearPrimerAdmin } from '../controllers/auth/primerAdminController.js';

// Importación de todas las rutas
import clienteRoutes from './clientes/clienteRoutes.js';
import dashboardRoutes from './finanzas/dashboardRoutes.js';
import devolucionRoutes from './finanzas/devolucionRoutes.js';
import gastoOperativoRoutes from './finanzas/gastoOperativoRoutes.js';
import pagoClienteRoutes from './finanzas/pagoClienteRoutes.js';
import ordenRoutes from './flujo/ordenRoutes.js';
import vehiculosCompatiblesRoutes from './inventario/vehiculosCompatiblesRoutes.js';
import proveedorRoutes from './inventario/proveedorRoute.js';
import productoRoutes from './inventario/productoRoutes.js';
import solicitudRoutes from './inventario/solicitudRoutes.js';
import marcaRoutes from './inventario/marcaRoutes.js';
import categoriaRoutes from './inventario/categoriaRoutes.js';
import notificacionesRoutes from './notificaciones/notificacionesRoutes.js';
import trabajadorRoutes from './trabajadores/trabajadoresRoutes.js';
import vehiculoRoutes from './vehiculos/vehiculosRoutes.js';
import ventaRoutes from './ventas/ventasRoutes.js';
import cotizacionRoutes from './ventas/cotizacionRoutes.js';
import reportesRouter from './reportes/reportes.js';
import authRoutes from './auth/auth.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

// Ruta de verificación básica
router.get('/', (req, res) => {
  res.json({ 
    status: 'API MYM funcionando', 
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      clientes: '/api/clientes',
      finanzas: '/api/finanzas',
    }
  });
});

// Ruta de health check
router.use('/health', healthRoutes);

// Ruta especial para creación del primer admin
router.post('/primer-admin', crearPrimerAdmin);

// Montaje de todas las rutas
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/finanzas/dashboard', dashboardRoutes);
router.use('/finanzas/devoluciones', devolucionRoutes);
router.use('/finanzas/gastos-operativos', gastoOperativoRoutes);
router.use('/finanzas/pagos-clientes', pagoClienteRoutes);
router.use('/flujo/ordenes', ordenRoutes);
router.use('/inventario/vehiculos', vehiculosCompatiblesRoutes);
router.use('/inventario/proveedores', proveedorRoutes);
router.use('/inventario/productos', productoRoutes);
router.use('/inventario/solicitudes', solicitudRoutes);
router.use('/inventario/marcas', marcaRoutes);
router.use('/inventario/categorias', categoriaRoutes);
router.use('/notificaciones', notificacionesRoutes);
router.use('/trabajadores', trabajadorRoutes);
router.use('/vehiculos', vehiculoRoutes);
router.use('/ventas', ventaRoutes);
router.use('/cotizacion', cotizacionRoutes);
router.use('/reportes', reportesRouter);

// Ruta de verificación de endpoints (opcional)
router.get('/check-routes', (req, res) => {
  res.json({
    auth: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/registrar',
      verificarSesion: 'GET /api/auth/verificar-sesion',
      cerrarSesion: 'POST /api/auth/cerrar-sesion',
      cambiarPassword: 'POST /api/auth/cambiar-password',
      recuperarPassword: 'POST /api/auth/recuperar-password',
      resetPassword: 'POST /api/auth/reset-password'
    },
    clientes: 'GET /api/clientes',
    // ... otros grupos de rutas
  });
});

export default router;