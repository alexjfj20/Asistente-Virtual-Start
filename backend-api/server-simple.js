// Servidor simplificado para pruebas - sin base de datos
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.'
});

app.use(helmet());
app.use(limiter);

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Datos en memoria para pruebas
let users = [
  {
    id: 1,
    email: 'admin@test.com',
    fullName: 'Administrador',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMye.VF3nBFr21qU6C7D0bNL7V4rkF6t4pe', // 'admin123'
    role: 'admin',
    phone: '+1234567890',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'client@test.com',
    fullName: 'Cliente de Prueba',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMye.VF3nBFr21qU6C7D0bNL7V4rkF6t4pe', // 'client123'
    role: 'client',
    phone: '+0987654321',
    createdAt: new Date().toISOString()
  }
];

let services = [
  {
    id: 1,
    name: 'Plan Todo-en-Uno - Carrera Remota',
    description: 'Acceso completo a todas nuestras herramientas y servicios',
    price: 17,
    duration: 'mensual',
    features: [
      'Optimización de CV con IA',
      'Preparación para entrevistas',
      'Búsqueda activa de empleo',
      'Evaluación de perfil freelance',
      'Evaluación para call centers',
      'Coaching profesional personalizado',
      'Acceso a todas las herramientas IA',
      'Soporte prioritario 24/7'
    ],
    category: 'Premium',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

let clientServices = [];

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente (modo de prueba)',
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      mode: 'memoria'
    }
  });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear nuevo usuario (sin hash real para simplicidad en pruebas)
    const newUser = {
      id: users.length + 1,
      email,
      fullName,
      password: `hashed_${password}`, // Simular hash
      role: 'client',
      phone: phone || null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Simular token JWT
    const token = `fake_jwt_token_for_user_${newUser.id}`;

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Simular verificación de contraseña
    if (password !== 'admin123' && password !== 'client123') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Simular token JWT
    const token = `fake_jwt_token_for_user_${user.id}`;

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Services endpoints
app.get('/api/services/available', (req, res) => {
  try {
    res.status(200).json({
      message: 'Servicios disponibles',
      services: services.filter(s => s.isActive)
    });
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Client endpoints
app.get('/api/clients/services', (req, res) => {
  try {
    // Simular autenticación (en una implementación real, verificaríamos el JWT)
    res.status(200).json({
      message: 'Servicios del cliente',
      services: clientServices
    });
  } catch (error) {
    console.error('Error obteniendo servicios del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  });
});

// Manejar errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: error.message
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`
🚀 Servidor Backend de Asistente Virtual Start (MODO PRUEBA)
📡 Puerto: ${PORT}
🌍 Entorno: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
📚 Documentación: http://localhost:${PORT}/api/health
⚠️  Nota: Ejecutándose sin base de datos para pruebas iniciales
  `);
});
