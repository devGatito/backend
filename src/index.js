import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoutes from './routes/admin.js'; // ✅ importa tus rutas
import trabajadoresRoutes from './routes/trabajadores.js';
import clientesRoutes from './routes/clientes.js';
import ordenesRoutes from './routes/flujo/ordenes.js';
import productosRoutes from './routes/inventario/productos.js';
import movimientosRoutes from './routes/inventario/movimientos.js';
import cotizacionesRoutes from './routes/ventas/cotizaciones.js';
import ventasRoutes from './routes/ventas/ventas.js';
import devolucionesRoutes from './routes/ventas/devoluciones.js';
import usuariosRoutes from './routes/usuarios.js'; 
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Montar las rutas bajo el prefijo /api/admin
app.use('/api/admin', adminRoutes);
app.use('/api/trabajadores', trabajadoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/cotizaciones', cotizacionesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/devoluciones', devolucionesRoutes);
app.use('/api/usuarios', usuariosRoutes);






app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
