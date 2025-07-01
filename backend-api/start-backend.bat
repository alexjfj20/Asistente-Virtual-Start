@echo off
echo.
echo ==========================================
echo    ASISTENTE VIRTUAL - BACKEND API
echo ==========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo 💡 Descarga e instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version

echo.
echo 📦 Verificando dependencias...

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📥 Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🔧 Verificando archivo de configuración...

REM Verificar si .env existe
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado
    echo 📝 Copiando plantilla de configuración...
    copy ".env.example" ".env"
    echo.
    echo ⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales
    echo    especialmente las credenciales de Google Cloud SQL
    pause
)

echo.
echo 🚀 Iniciando servidor...
echo 📍 URL: http://localhost:8080
echo 💡 Presiona Ctrl+C para detener el servidor
echo.

call npm start
