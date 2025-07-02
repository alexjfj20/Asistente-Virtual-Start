// Verificación completa del sistema después de la configuración
console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA\n');

const API_BASE = 'http://localhost:8080/api';

async function verifyCompleteSystem() {
  console.log('📊 ESTADO DEL SISTEMA - Asistente Virtual Start');
  console.log('=' .repeat(50));
  
  let allTestsPassed = true;
  const results = {
    backend: false,
    database: false,
    services: false,
    auth: false,
    frontend: false
  };

  // 1. Verificar Backend
  console.log('\n1. 🚀 VERIFICANDO BACKEND...');
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('   ✅ Backend funcionando correctamente');
      console.log(`   📊 Estado: ${healthData.status}`);
      console.log(`   🕐 Timestamp: ${healthData.timestamp}`);
      results.backend = true;
      
      if (healthData.database && healthData.database.connected) {
        console.log('   ✅ Base de datos Supabase conectada');
        results.database = true;
      } else {
        console.log('   ❌ Base de datos no conectada');
        allTestsPassed = false;
      }
    } else {
      console.log('   ❌ Error en backend:', healthData);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Backend no accesible:', error.message);
    allTestsPassed = false;
  }

  // 2. Verificar Servicios
  console.log('\n2. 🛠️ VERIFICANDO SERVICIOS...');
  try {
    const servicesResponse = await fetch(`${API_BASE}/services/available`);
    const servicesData = await servicesResponse.json();
    
    if (servicesResponse.ok && servicesData.services) {
      console.log('   ✅ Servicios disponibles cargados');
      console.log(`   📋 Total servicios: ${servicesData.services.length}`);
      
      if (servicesData.services.length > 0) {
        console.log(`   🛠️  Primer servicio: ${servicesData.services[0].name}`);
        console.log(`   💰 Precio: $${servicesData.services[0].price}`);
        results.services = true;
      }
    } else {
      console.log('   ❌ Error obteniendo servicios');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Error en servicios:', error.message);
    allTestsPassed = false;
  }

  // 3. Verificar Autenticación
  console.log('\n3. 🔐 VERIFICANDO AUTENTICACIÓN...');
  try {
    // Probar registro
    const testUser = {
      email: `test_${Date.now()}@example.com`,
      password: 'test123456',
      fullName: 'Usuario Verificación Sistema',
      phone: '+1234567890'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();

    if (registerResponse.ok && registerData.user) {
      console.log('   ✅ Registro funcionando');
      console.log(`   👤 Usuario creado: ${registerData.user.fullName}`);
      console.log(`   🎫 Token recibido: ${registerData.token ? 'Sí' : 'No'}`);

      // Probar login
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.token) {
        console.log('   ✅ Login funcionando');
        console.log('   ✅ JWT tokens operativos');
        results.auth = true;
      } else {
        console.log('   ❌ Error en login');
        allTestsPassed = false;
      }
    } else {
      console.log('   ❌ Error en registro:', registerData.error || 'Error desconocido');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Error en autenticación:', error.message);
    allTestsPassed = false;
  }

  // 4. Verificar Frontend (archivos)
  console.log('\n4. 🎨 VERIFICANDO FRONTEND...');
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const frontendFiles = [
      'asistente-virtual-start/package.json',
      'asistente-virtual-start/App.tsx',
      'asistente-virtual-start/services/api.js',
      'asistente-virtual-start/.env.local'
    ];
    
    let frontendOk = true;
    for (const file of frontendFiles) {
      if (fs.existsSync(file)) {
        console.log(`   ✅ ${file.split('/').pop()}`);
      } else {
        console.log(`   ❌ ${file} no encontrado`);
        frontendOk = false;
      }
    }
    
    if (frontendOk) {
      console.log('   ✅ Archivos del frontend completos');
      results.frontend = true;
    } else {
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Error verificando frontend:', error.message);
    allTestsPassed = false;
  }

  // 5. Resumen Final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(50));
  
  console.log(`🚀 Backend API:        ${results.backend ? '✅ FUNCIONANDO' : '❌ ERROR'}`);
  console.log(`🗄️  Base de Datos:      ${results.database ? '✅ CONECTADA' : '❌ ERROR'}`);
  console.log(`🛠️  Servicios:          ${results.services ? '✅ OPERATIVOS' : '❌ ERROR'}`);
  console.log(`🔐 Autenticación:      ${results.auth ? '✅ FUNCIONANDO' : '❌ ERROR'}`);
  console.log(`🎨 Frontend:           ${results.frontend ? '✅ CONFIGURADO' : '❌ ERROR'}`);
  
  console.log('\n' + '='.repeat(50));
  
  if (allTestsPassed) {
    console.log('🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
    console.log('\n📝 PRÓXIMOS PASOS:');
    console.log('   1. Iniciar backend: cd backend-api && npm start');
    console.log('   2. Iniciar frontend: cd asistente-virtual-start && npm run dev');
    console.log('   3. Abrir navegador: http://localhost:5173');
    console.log('   4. Probar con credenciales: admin@asistentevirtual.com / admin123');
    console.log('\n🚀 ¡LISTO PARA DEPLOY A PRODUCCIÓN!');
  } else {
    console.log('❌ SISTEMA CON ERRORES - REVISAR CONFIGURACIÓN');
    console.log('\n🔧 ACCIONES REQUERIDAS:');
    if (!results.backend) console.log('   • Verificar configuración del backend');
    if (!results.database) console.log('   • Verificar conexión a Supabase');
    if (!results.services) console.log('   • Ejecutar setup de base de datos');
    if (!results.auth) console.log('   • Verificar configuración JWT');
    if (!results.frontend) console.log('   • Verificar archivos del frontend');
  }
  
  console.log('\n📞 COMANDOS DE DIAGNÓSTICO:');
  console.log('   • node test-supabase-connection.js');
  console.log('   • cd backend-api && npm run setup-supabase');
  console.log('   • curl http://localhost:8080/api/health');
  
  return allTestsPassed;
}

// Ejecutar verificación
verifyCompleteSystem().catch(error => {
  console.error('❌ Error en verificación del sistema:', error);
});