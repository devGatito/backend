import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import rutas from './src/routes/index.js';

const app = express();
const PORT = 3001;

// 1. Configuración CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', // Desarrollo frontend
    
    // Agrega aquí otros dominios en producción
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Session-Id'],
  credentials: true,
  optionsSuccessStatus: 204
};

// 2. Middlewares de seguridad
app.use(helmet()); // Protección contra vulnerabilidades comunes
app.use(cors(corsOptions)); // Habilitar CORS con opciones configuradas

// 3. Límite de peticiones (rate limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 4. Middlewares para parsear el cuerpo de las peticiones
app.use(express.json({ limit: '10kb' })); // Límite de 10kb para JSON
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Logger básico (para desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// 6. Rutas principales
app.use('/api', rutas); // Todas las rutas tendrán el prefijo /api

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});