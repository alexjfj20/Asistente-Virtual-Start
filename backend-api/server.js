// Importar las librerías necesarias
import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Importar rutas
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import servicesRoutes from './routes/services.js';
import adminRoutes from './routes/admin.js';

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app = express();

// Configurar rate limiting (protección contra ataques de fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP en 15 minutos
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.'
});

// Middlewares de seguridad
app.use(helmet()); // Configurar headers de seguridad
app.use(limiter); // Aplicar rate limiting

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar la conexión a la base de datos PostgreSQL
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    // Google Cloud SQL requiere SSL en producción
    rejectUnauthorized: false 
  },
  // Configuración del pool de conexiones
  max: 20, // máximo 20 conexiones
  idleTimeoutMillis: 30000, // cerrar conexiones inactivas después de 30 segundos
  connectionTimeoutMillis: 2000, // timeout de conexión de 2 segundos
});

// Middleware para verificar la conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    // Verificar que la conexión esté disponible
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    res.status(503).json({ 
      error: 'Servicio temporalmente no disponible. Intenta de nuevo más tarde.' 
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/admin', adminRoutes);

// Endpoint de salud del servidor
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'OK',
      message: 'Servidor y base de datos funcionando correctamente',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        serverTime: dbResult.rows[0].now
      }
    });
  } catch (error) {
    console.error('Error en el endpoint de salud:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Problemas con la conexión a la base de datos',
      timestamp: new Date().toISOString(),
      database: {
        connected: false
      }
    });
  }
});

// Endpoint de prueba para verificar la conexión
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW(), VERSION()');
    res.status(200).json({
      message: '¡Conexión a la base de datos exitosa!',
      databaseTime: result.rows[0].now,
      databaseVersion: result.rows[0].version,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ 
      error: 'No se pudo conectar a la base de datos.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe en este servidor.`
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal. Por favor, intenta de nuevo.'
  });
});

// Iniciar el servidor
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`
🚀 Servidor Backend de Asistente Virtual Start
📡 Puerto: ${port}
🌍 Entorno: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${port}
📚 Documentación: http://localhost:${port}/api/health
  `);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await pool.end();
  console.log('📊 Conexiones de base de datos cerradas.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await pool.end();
  console.log('📊 Conexiones de base de datos cerradas.');
  process.exit(0);
});
