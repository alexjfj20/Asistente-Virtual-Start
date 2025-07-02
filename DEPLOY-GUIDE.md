# 🚀 Guía Completa de Deploy - Asistente Virtual Start

## 📋 Resumen del Sistema

### ✅ Estado Actual
- **Backend**: Node.js + Express + PostgreSQL ✅ Funcionando
- **Frontend**: React + Vite + Tailwind CSS ✅ Funcionando  
- **Base de Datos**: PostgreSQL con datos iniciales ✅ Configurada
- **Integración**: Frontend ↔️ Backend ✅ Completa

### 🏗️ Arquitectura
```
Frontend (React/Vite:5173) ↔️ Backend (Node.js/Express:8080) ↔️ PostgreSQL Database
```

## 🔧 Configuración Local Completada

### Backend (Puerto 8080)
- ✅ API REST completa con autenticación JWT
- ✅ Base de datos PostgreSQL configurada
- ✅ Endpoints para servicios, usuarios y administración
- ✅ Seguridad implementada (CORS, Rate Limiting, Helmet)
- ✅ Datos de prueba insertados

### Frontend (Puerto 5173)
- ✅ Interfaz React moderna y responsiva
- ✅ Integración completa con backend
- ✅ Flujo de autenticación funcional
- ✅ Dashboard de cliente y administración
- ✅ Herramientas de IA integradas

## 🌐 Opciones de Deploy

### 1. Deploy en Vercel (Frontend) + Railway (Backend)

#### Frontend en Vercel:
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desde el directorio del frontend
cd asistente-virtual-start
vercel

# 3. Configurar variables de entorno en Vercel:
# VITE_API_BASE_URL=https://tu-backend.railway.app/api
# VITE_GEMINI_API_KEY=tu-api-key
```

#### Backend en Railway:
```bash
# 1. Conectar repositorio a Railway
# 2. Configurar variables de entorno:
# DB_USER=postgres
# DB_HOST=tu-postgresql-host
# DB_DATABASE=asistente_virtual_db
# DB_PASSWORD=tu-password
# DB_PORT=5432
# JWT_SECRET=tu-jwt-secret
# FRONTEND_URL=https://tu-frontend.vercel.app
# NODE_ENV=production
```

### 2. Deploy en Netlify (Frontend) + Heroku (Backend)

#### Frontend en Netlify:
```bash
# 1. Build del proyecto
cd asistente-virtual-start
npm run build

# 2. Subir carpeta dist/ a Netlify
# 3. Configurar variables de entorno en Netlify
```

#### Backend en Heroku:
```bash
# 1. Instalar Heroku CLI
# 2. Crear app
heroku create tu-app-backend

# 3. Agregar PostgreSQL
heroku addons:create heroku-postgresql:mini

# 4. Deploy
git push heroku main
```

### 3. Deploy en DigitalOcean (Completo)

#### Droplet con Docker:
```dockerfile
# Dockerfile para backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 🔐 Variables de Entorno para Producción

### Backend (.env):
```env
# Base de datos
DB_USER=tu_usuario_db
DB_HOST=tu_host_db
DB_DATABASE=asistente_virtual_db
DB_PASSWORD=tu_password_seguro
DB_PORT=5432

# Servidor
PORT=8080
NODE_ENV=production

# Seguridad
JWT_SECRET=una-clave-jwt-super-segura-de-al-menos-32-caracteres

# CORS
FRONTEND_URL=https://tu-dominio-frontend.com
```

### Frontend (.env.local):
```env
VITE_API_BASE_URL=https://tu-backend.com/api
VITE_GEMINI_API_KEY=tu-gemini-api-key
VITE_APP_NAME=Asistente Virtual Start
```

## 📊 Checklist Pre-Deploy

### Backend:
- ✅ Variables de entorno configuradas
- ✅ Base de datos PostgreSQL accesible
- ✅ Script de inicialización ejecutado
- ✅ Endpoints probados
- ✅ Autenticación funcionando
- ✅ CORS configurado para dominio de producción

### Frontend:
- ✅ Build de producción exitoso
- ✅ Variables de entorno configuradas
- ✅ API endpoints apuntando a producción
- ✅ Rutas funcionando correctamente
- ✅ Responsive design verificado

### Base de Datos:
- ✅ PostgreSQL instalado y configurado
- ✅ Tablas creadas con script init.sql
- ✅ Datos iniciales insertados
- ✅ Usuario admin creado
- ✅ Conexiones SSL configuradas (si es necesario)

## 🧪 Pruebas Post-Deploy

### 1. Verificar Backend:
```bash
curl https://tu-backend.com/api/health
```

### 2. Verificar Frontend:
- Abrir https://tu-frontend.com
- Probar registro de usuario
- Probar login
- Verificar dashboard
- Probar herramientas de IA

### 3. Verificar Integración:
- Flujo completo de registro → login → dashboard
- Contratación de servicios
- Funcionalidad de administración

## 🔧 Comandos de Deploy Rápido

### Deploy Completo en Railway + Vercel:

```bash
# 1. Backend en Railway
cd backend-api
# Conectar repositorio a Railway
# Configurar variables de entorno
# Deploy automático

# 2. Frontend en Vercel
cd asistente-virtual-start
npm run build
vercel --prod
```

## 🚨 Consideraciones de Seguridad

### Producción:
1. **Cambiar credenciales por defecto**:
   - Usuario admin: admin@asistentevirtual.com / admin123
   - Cliente prueba: cliente@test.com / admin123

2. **Configurar HTTPS** en ambos servicios

3. **Configurar variables de entorno** seguras

4. **Habilitar logs** de producción

5. **Configurar backups** de base de datos

## 📞 Soporte Post-Deploy

### Logs importantes:
```bash
# Backend logs
heroku logs --tail -a tu-app-backend

# Frontend logs (Vercel)
vercel logs tu-deployment-url
```

### Endpoints de diagnóstico:
- `GET /api/health` - Estado del servidor
- `GET /api/test-db` - Conexión a base de datos

## 🎯 URLs Finales

Después del deploy tendrás:
- **Frontend**: https://tu-app.vercel.app
- **Backend**: https://tu-app.railway.app
- **Admin Panel**: https://tu-app.vercel.app (login como admin)

---

**¡Tu aplicación está lista para producción! 🎉**

El sistema está completamente funcional y puede escalarse según las necesidades.