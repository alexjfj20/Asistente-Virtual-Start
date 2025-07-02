# 🚀 Asistente Virtual Start - Aplicación Completa

## 📋 Descripción

Plataforma completa para aspirantes a Asistentes Virtuales que incluye herramientas de IA, gestión de servicios, autenticación y panel de administración.

## 🏗️ Arquitectura del Sistema

```
Frontend (React + Vite)  ↔️  Backend (Node.js + Express)  ↔️  PostgreSQL Database
     Puerto 5173                    Puerto 8080                  Puerto 5432
```

## ✨ Características Principales

### 🎯 Frontend
- ✅ **Interfaz moderna** con React 19 + Tailwind CSS
- ✅ **Herramientas de IA** integradas (Gemini API)
- ✅ **Autenticación completa** (registro/login)
- ✅ **Dashboard de cliente** interactivo
- ✅ **Panel de administración** completo
- ✅ **Diseño responsivo** para todos los dispositivos
- ✅ **Optimización de CV con IA**
- ✅ **Simulador de entrevistas**
- ✅ **Asesor freelance**

### 🔧 Backend
- ✅ **API REST completa** con Express.js
- ✅ **Autenticación JWT** segura
- ✅ **Base de datos PostgreSQL** optimizada
- ✅ **Seguridad avanzada** (CORS, Rate Limiting, Helmet)
- ✅ **Validación de datos** robusta
- ✅ **Manejo de errores** profesional
- ✅ **Documentación de API** completa

### 🗄️ Base de Datos
- ✅ **PostgreSQL** con esquema optimizado
- ✅ **Datos iniciales** para pruebas
- ✅ **Índices** para rendimiento
- ✅ **Triggers** para auditoría
- ✅ **Roles de usuario** (cliente/admin)

## 🚀 Inicio Rápido

### 1. Clonar y Configurar

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd asistente-virtual-start

# Instalar dependencias del backend
cd backend-api
npm install

# Configurar base de datos
npm run setup-db

# Iniciar backend
npm start
```

### 2. Configurar Frontend

```bash
# En otra terminal
cd asistente-virtual-start
npm install

# Iniciar frontend
npm run dev
```

### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/health

## 🔑 Credenciales de Prueba

### Administrador
- **Email**: admin@asistentevirtual.com
- **Contraseña**: admin123

### Cliente de Prueba
- **Email**: cliente@test.com
- **Contraseña**: admin123

## 📁 Estructura del Proyecto

```
asistente-virtual-start/
├── backend-api/                 # Backend Node.js
│   ├── routes/                  # Rutas de la API
│   │   ├── auth.js             # Autenticación
│   │   ├── clients.js          # Gestión de clientes
│   │   ├── services.js         # Servicios
│   │   └── admin.js            # Administración
│   ├── database/
│   │   └── init.sql            # Script de base de datos
│   ├── server.js               # Servidor principal
│   ├── setup-database.js       # Configurador de BD
│   └── package.json
│
├── asistente-virtual-start/     # Frontend React
│   ├── components/             # Componentes React
│   │   ├── Auth/              # Autenticación
│   │   ├── Dashboard/         # Panel de cliente
│   │   ├── Admin/             # Panel de admin
│   │   ├── AiTools/           # Herramientas de IA
│   │   └── ui/                # Componentes base
│   ├── services/
│   │   └── api.js             # Cliente API
│   ├── App.tsx                # Aplicación principal
│   ├── types.ts               # Tipos TypeScript
│   ├── constants.ts           # Constantes
│   └── package.json
│
├── DEPLOY-GUIDE.md             # Guía de deploy
└── README.md                   # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Vite** - Build tool moderno
- **Google Gemini AI** - Inteligencia artificial

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Helmet** - Seguridad HTTP

## 🔧 Configuración de Desarrollo

### Variables de Entorno

#### Backend (.env):
```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=asistente_virtual_db
DB_PASSWORD=postgres
DB_PORT=5432
PORT=8080
NODE_ENV=development
JWT_SECRET=tu-clave-jwt-super-secreta
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env.local):
```env
VITE_GEMINI_API_KEY=tu-gemini-api-key
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🧪 Pruebas

### Backend
```bash
cd backend-api
npm test
```

### Conectividad Completa
```bash
node test-connectivity.js
```

## 📊 Funcionalidades Implementadas

### 👤 Gestión de Usuarios
- [x] Registro de usuarios
- [x] Login/logout
- [x] Verificación de tokens
- [x] Roles (cliente/admin)
- [x] Perfil de usuario

### 🛠️ Servicios
- [x] Catálogo de servicios
- [x] Contratación de servicios
- [x] Seguimiento de estado
- [x] Solicitudes de actualización
- [x] Historial de servicios

### 🤖 Herramientas de IA
- [x] Optimización de CV
- [x] Asesor virtual personalizado
- [x] Simulador de entrevistas para call center
- [x] Asesor freelance profesional
- [x] Chat interactivo con IA

### 👑 Panel de Administración
- [x] Gestión de clientes
- [x] Gestión de servicios
- [x] Configuración de pagos
- [x] Estadísticas y reportes
- [x] Actualización de estados

## 🚀 Deploy a Producción

Ver [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) para instrucciones completas de deploy.

### Opciones Recomendadas:
1. **Vercel** (Frontend) + **Railway** (Backend)
2. **Netlify** (Frontend) + **Heroku** (Backend)
3. **DigitalOcean** (Completo)

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Headers de seguridad
- ✅ Validación de entrada
- ✅ Protección SQL injection

## 📞 Soporte

### Problemas Comunes

1. **Error de conexión a BD**:
   ```bash
   npm run setup-db
   ```

2. **Error CORS**:
   - Verificar FRONTEND_URL en .env del backend

3. **Error 401**:
   - Token expirado, hacer login nuevamente

### Logs de Desarrollo
```bash
# Backend
cd backend-api && npm run dev

# Frontend  
cd asistente-virtual-start && npm run dev
```

## 🎯 Roadmap

### Próximas Características
- [ ] Integración con Stripe real
- [ ] Sistema de notificaciones
- [ ] Chat en tiempo real
- [ ] Análisis avanzado con IA
- [ ] API de terceros (LinkedIn, etc.)
- [ ] Sistema de archivos
- [ ] Notificaciones push

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

**¡Desarrollado con ❤️ para impulsar carreras como Asistente Virtual!**

Para más información, consulta la [documentación de deploy](./DEPLOY-GUIDE.md) o contacta al equipo de desarrollo.