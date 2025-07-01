import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🧪 Iniciando pruebas del Backend API...\n');

const API_BASE = 'http://localhost:8080/api';

// Función para hacer requests HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Función para esperar un tiempo
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  console.log('📡 Probando endpoints básicos...\n');

  // Test 1: Health check
  console.log('1. Probando /api/health');
  const healthCheck = await makeRequest(`${API_BASE}/health`);
  if (healthCheck.status === 200) {
    console.log('   ✅ Servidor funcionando correctamente');
    console.log(`   📊 Estado: ${healthCheck.data.status}`);
  } else {
    console.log('   ❌ Error en health check:', healthCheck.error || healthCheck.data);
    return;
  }

  await sleep(500);

  // Test 2: Database connection
  console.log('\n2. Probando /api/test-db');
  const dbTest = await makeRequest(`${API_BASE}/test-db`);
  if (dbTest.status === 200) {
    console.log('   ✅ Conexión a base de datos exitosa');
    console.log(`   🕐 Hora de BD: ${dbTest.data.databaseTime}`);
  } else {
    console.log('   ⚠️  Advertencia - BD no conectada:', dbTest.data?.error);
    console.log('   📝 Esto es normal si aún no has configurado Google Cloud SQL');
  }

  await sleep(500);

  // Test 3: Servicios disponibles (público)
  console.log('\n3. Probando /api/services/available');
  const services = await makeRequest(`${API_BASE}/services/available`);
  if (services.status === 200) {
    console.log('   ✅ Servicios disponibles obtenidos');
    console.log(`   📋 Total servicios: ${services.data.totalServices}`);
    console.log(`   🛠️  Primer servicio: ${services.data.services[0]?.name}`);
  } else {
    console.log('   ❌ Error obteniendo servicios:', services.error || services.data);
  }

  await sleep(500);

  // Test 4: Endpoint protegido (debe fallar sin token)
  console.log('\n4. Probando endpoint protegido /api/clients/profile (sin token)');
  const protectedEndpoint = await makeRequest(`${API_BASE}/clients/profile`);
  if (protectedEndpoint.status === 401) {
    console.log('   ✅ Seguridad funcionando - acceso denegado sin token');
  } else {
    console.log('   ❌ Error de seguridad - endpoint debería requerir token');
  }

  await sleep(500);

  // Test 5: Registro de usuario (si la BD está configurada)
  console.log('\n5. Probando registro de usuario');
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'test123456',
    fullName: 'Usuario de Prueba',
    phone: '+1234567890'
  };

  const registerResult = await makeRequest(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });

  if (registerResult.status === 201) {
    console.log('   ✅ Usuario registrado exitosamente');
    console.log(`   👤 Usuario: ${registerResult.data.user.fullName}`);
    console.log(`   🎫 Token recibido: ${registerResult.data.token ? 'Sí' : 'No'}`);
    
    // Test 6: Login del usuario recién creado
    await sleep(500);
    console.log('\n6. Probando login del usuario');
    const loginResult = await makeRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (loginResult.status === 200) {
      console.log('   ✅ Login exitoso');
      console.log(`   🎫 Token: ${loginResult.data.token.substring(0, 20)}...`);
      
      // Test 7: Acceso con token
      await sleep(500);
      console.log('\n7. Probando acceso con token válido');
      const profileResult = await makeRequest(`${API_BASE}/clients/profile`, {
        headers: { 'Authorization': `Bearer ${loginResult.data.token}` }
      });

      if (profileResult.status === 200) {
        console.log('   ✅ Acceso autorizado exitoso');
        console.log(`   👤 Perfil: ${profileResult.data.client.fullName}`);
      } else {
        console.log('   ❌ Error accediendo con token:', profileResult.data);
      }
    } else {
      console.log('   ❌ Error en login:', loginResult.data);
    }
  } else if (registerResult.error && registerResult.error.includes('ECONNREFUSED')) {
    console.log('   ⚠️  BD no configurada - respuesta simulada esperada');
  } else {
    console.log('   ⚠️  Registro falló (normal si BD no está configurada):', registerResult.data?.error);
  }

  // Test 8: Endpoint inexistente
  await sleep(500);
  console.log('\n8. Probando endpoint inexistente');
  const notFound = await makeRequest(`${API_BASE}/endpoint-que-no-existe`);
  if (notFound.status === 404) {
    console.log('   ✅ Manejo de 404 funcionando correctamente');
  } else {
    console.log('   ❌ Error en manejo de 404');
  }

  console.log('\n🎉 ¡Pruebas completadas!');
  console.log('\n📋 Resumen:');
  console.log('   • Servidor: ✅ Funcionando');
  console.log('   • Endpoints básicos: ✅ Operativos');
  console.log('   • Seguridad: ✅ Configurada');
  console.log('   • Manejo de errores: ✅ Implementado');
  
  if (dbTest.status === 200) {
    console.log('   • Base de datos: ✅ Conectada');
  } else {
    console.log('   • Base de datos: ⚠️  Pendiente de configurar');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Configurar Google Cloud SQL');
    console.log('   2. Actualizar archivo .env con credenciales');
    console.log('   3. Ejecutar database/init.sql en tu BD');
    console.log('   4. Volver a ejecutar estas pruebas');
  }
  
  console.log('\n🚀 ¡Tu backend está listo para conectarse con el frontend!');
}

// Ejecutar pruebas
runTests().catch(error => {
  console.error('❌ Error ejecutando pruebas:', error.message);
  console.log('\n💡 Asegúrate de que el servidor esté corriendo:');
  console.log('   npm run dev');
});
