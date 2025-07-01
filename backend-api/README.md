# Backend API - Asistente Virtual Start

## 📋 Descripción

Backend profesional para la aplicación Asistente Virtual Start. Proporciona una API REST segura para gestionar usuarios, servicios, autenticación y administración.

## 🏗️ Arquitectura

```
Frontend (React/Vite) ↔️ Backend (Node.js/Express) ↔️ Database (PostgreSQL en Google Cloud)
```

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
cd backend-api
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus datos reales:

```env
# Configuración de la Base de Datos (Google Cloud SQL)
DB_USER=postgres
DB_HOST=TU_IP_DE_GOOGLE_CLOUD_SQL
DB_DATABASE=asistente_virtual_db
DB_PASSWORD=TU_CONTRASEÑA_SEGURA
DB_PORT=5432

# Configuración del Servidor
PORT=8080
NODE_ENV=development

# Seguridad JWT (generar una clave segura)
JWT_SECRET=una-clave-super-secreta-muy-larga-y-segura

# Configuración de CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Base de Datos

#### En Google Cloud SQL:

1. **Conectar a tu instancia:**
   - Ve a Google Cloud Console
   - Navega a SQL → Tu instancia
   - Clic en "Conectar usando Cloud Shell"

2. **Ejecutar script de inicialización:**
   ```sql
   \i database/init.sql
   ```

#### O usando un cliente local:
```bash
psql -h TU_IP_GOOGLE_CLOUD -U postgres -d asistente_virtual_db -f database/init.sql
```

### 4. Configurar Red en Google Cloud SQL

1. Ve a tu instancia de Cloud SQL
2. Pestaña "Conexiones" → "Redes autorizadas"
3. Añade tu IP pública (busca "cuál es mi IP" en Google)
4. Guarda los cambios

## 🎯 Ejecutar el Servidor

### Modo Desarrollo (con recarga automática):
```bash
npm run dev
```

### Modo Producción:
```bash
npm start
```

El servidor estará disponible en: `http://localhost:8080`

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/verify` | Verificar token |

### 👤 Clientes (`/api/clients`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/clients/profile` | Obtener perfil | ✅ |
| PUT | `/api/clients/profile` | Actualizar perfil | ✅ |
| GET | `/api/clients/services` | Servicios del cliente | ✅ |
| POST | `/api/clients/services/:id/request-update` | Solicitar actualización | ✅ |

### 🛠️ Servicios (`/api/services`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/services/available` | Servicios disponibles | ❌ |
| POST | `/api/services/hire` | Contratar servicio | ✅ |
| GET | `/api/services/:id` | Detalles del servicio | ✅ |

### 👑 Administración (`/api/admin`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/clients` | Listar clientes | ✅ Admin |
| GET | `/api/admin/services` | Listar servicios | ✅ Admin |
| PATCH | `/api/admin/services/:id/status` | Actualizar estado | ✅ Admin |
| GET | `/api/admin/dashboard/stats` | Estadísticas | ✅ Admin |

### 🔍 Utilidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/test-db` | Probar conexión BD |

## 🔧 Ejemplos de Uso

### Registrar Usuario
```javascript
fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'cliente@example.com',
    password: 'mi-contraseña-segura',
    fullName: 'Juan Pérez',
    phone: '+1234567890'
  })
})
```

### Iniciar Sesión
```javascript
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'cliente@example.com',
    password: 'mi-contraseña-segura'
  })
})
```

### Obtener Servicios (con autenticación)
```javascript
fetch('http://localhost:8080/api/clients/services', {
  headers: {
    'Authorization': 'Bearer TU_TOKEN_JWT'
  }
})
```

## 🔒 Seguridad Implementada

- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **JWT** para autenticación
- ✅ **Rate limiting** (100 requests/15min)
- ✅ **Helmet** para headers de seguridad
- ✅ **CORS** configurado
- ✅ **Validación de entrada** con validator
- ✅ **SQL injection protection** con parámetros preparados
- ✅ **Roles de usuario** (client/admin)

## 🧪 Probar la API

### 1. Verificar que funciona:
```bash
curl http://localhost:8080/api/health
```

### 2. Probar conexión a base de datos:
```bash
curl http://localhost:8080/api/test-db
```

### 3. Registrar un usuario:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Usuario Prueba"
  }'
```

## 🔗 Integración con Frontend

En tu aplicación React, crea un servicio API:

```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  // Autenticación
  register: (userData) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),
  
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
  
  // Servicios (requieren token)
  getMyServices: (token) =>
    fetch(`${API_BASE_URL}/clients/services`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
  
  getAvailableServices: () =>
    fetch(`${API_BASE_URL}/services/available`)
};
```

## 📊 Monitoreo y Logs

Los logs se muestran en la consola con información detallada:
- ✅ Requests HTTP
- ✅ Errores de base de datos
- ✅ Autenticación fallida
- ✅ Estado de conexiones

## 🚀 Despliegue a Producción

### Variables importantes para producción:
```env
NODE_ENV=production
JWT_SECRET=una-clave-mucho-mas-segura-en-produccion
DB_HOST=tu-ip-de-produccion
FRONTEND_URL=https://tu-dominio.com
```

### Recomendaciones adicionales:
- Usar HTTPS en producción
- Configurar un reverse proxy (nginx)
- Implementar logs externos (Winston + CloudWatch)
- Configurar backup automático de BD
- Implementar health checks

## 🆘 Solución de Problemas

### Error de conexión a BD:
1. Verificar IP autorizada en Google Cloud SQL
2. Verificar credenciales en `.env`
3. Probar conexión: `curl http://localhost:8080/api/test-db`

### Error CORS:
1. Verificar `FRONTEND_URL` en `.env`
2. Asegurar que el frontend esté corriendo en esa URL

### Error 503 (Service Unavailable):
1. Verificar que la base de datos esté corriendo
2. Verificar conectividad de red

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Prueba los endpoints básicos primero
4. Confirma que la base de datos tenga las tablas creadas

---

¡Tu backend profesional está listo! 🎉
