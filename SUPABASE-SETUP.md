# 🚀 Configuración de Supabase - Asistente Virtual Start

## 📋 Información de tu Base de Datos

- **Proyecto**: AsistenteVirtualStart
- **URL**: https://nejokwxyjsryuhjbexmd.supabase.co
- **ID**: nejokwxyjsryuhjbexmd

## 🔧 Pasos de Configuración

### 1. Obtener Credenciales de Supabase

1. **Ve a tu proyecto en Supabase**: https://supabase.com/dashboard/project/nejokwxyjsryuhjbexmd
2. **Ir a Settings → Database**
3. **Copiar la información de conexión**:
   - Host: `db.nejokwxyjsryuhjbexmd.supabase.co`
   - Database name: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: `[tu contraseña]`

4. **Ir a Settings → API**
5. **Copiar las API Keys**:
   - URL: `https://nejokwxyjsryuhjbexmd.supabase.co`
   - anon public: `[tu anon key]`
   - service_role: `[tu service role key]`

### 2. Configurar Variables de Entorno

Edita el archivo `backend-api/.env`:

```env
# Configuración de Supabase
DB_USER=postgres
DB_HOST=db.nejokwxyjsryuhjbexmd.supabase.co
DB_DATABASE=postgres
DB_PASSWORD=TU_PASSWORD_DE_SUPABASE
DB_PORT=5432

# Configuración del Servidor
PORT=8080
NODE_ENV=development

# Seguridad JWT
JWT_SECRET=asistente-virtual-jwt-secret-super-seguro-2024

# Configuración de CORS
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://nejokwxyjsryuhjbexmd.supabase.co
SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

Edita el archivo `asistente-virtual-start/.env.local`:

```env
# Configuración para desarrollo local
VITE_GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# URL del backend
VITE_API_BASE_URL=http://localhost:8080/api

# Configuración de Supabase
VITE_SUPABASE_URL=https://nejokwxyjsryuhjbexmd.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY

# Configuración de la aplicación
VITE_APP_NAME=Asistente Virtual Start
VITE_WHATSAPP_NUMBER=1234567890
```

### 3. Probar Conexión

```bash
# Probar conexión a Supabase
node test-supabase-connection.js
```

### 4. Configurar Base de Datos

```bash
# Instalar dependencias del backend
cd backend-api
npm install

# Configurar tablas y datos iniciales en Supabase
npm run setup-supabase
```

### 5. Iniciar Aplicación

```bash
# Terminal 1: Backend
cd backend-api
npm start

# Terminal 2: Frontend
cd asistente-virtual-start
npm install
npm run dev
```

## 🧪 Verificación

### 1. Backend funcionando:
- http://localhost:8080/api/health

### 2. Frontend funcionando:
- http://localhost:5173

### 3. Credenciales de prueba:
- **Admin**: admin@asistentevirtual.com / admin123
- **Cliente**: cliente@test.com / admin123

## 🔒 Configuración de Seguridad en Supabase

### Row Level Security (RLS)

En el panel de Supabase, ve a **Authentication → Policies** y configura:

1. **Tabla `users`**:
   ```sql
   -- Política para que los usuarios solo vean su propia información
   CREATE POLICY "Users can view own profile" ON users
   FOR SELECT USING (auth.uid()::text = id::text);
   ```

2. **Tabla `client_services`**:
   ```sql
   -- Política para que los clientes solo vean sus servicios
   CREATE POLICY "Clients can view own services" ON client_services
   FOR SELECT USING (auth.uid()::text = client_id::text);
   ```

### Configurar Authentication

1. **Ve a Authentication → Settings**
2. **Habilitar Email confirmations** (opcional)
3. **Configurar Email templates** (opcional)

## 🚀 Deploy a Producción

### Variables de Entorno para Producción:

```env
# Backend
DB_HOST=db.nejokwxyjsryuhjbexmd.supabase.co
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_produccion
NODE_ENV=production
JWT_SECRET=jwt-secret-super-seguro-produccion
FRONTEND_URL=https://tu-dominio-frontend.com

# Frontend
VITE_API_BASE_URL=https://tu-backend-produccion.com/api
VITE_SUPABASE_URL=https://nejokwxyjsryuhjbexmd.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

## 🆘 Solución de Problemas

### Error de Conexión:
```bash
# Verificar configuración
node test-supabase-connection.js
```

### Error de Autenticación:
- Verificar DB_PASSWORD en .env
- Verificar que la contraseña sea correcta en Supabase

### Tablas no encontradas:
```bash
cd backend-api
npm run setup-supabase
```

### Error CORS:
- Verificar FRONTEND_URL en backend/.env
- Verificar que el frontend esté en el puerto correcto

## 📞 Comandos Útiles

```bash
# Probar conexión
node test-supabase-connection.js

# Configurar base de datos
cd backend-api && npm run setup-supabase

# Iniciar backend
cd backend-api && npm start

# Iniciar frontend
cd asistente-virtual-start && npm run dev

# Probar API
curl http://localhost:8080/api/health
```

---

**¡Tu aplicación está lista para funcionar con Supabase! 🎉**