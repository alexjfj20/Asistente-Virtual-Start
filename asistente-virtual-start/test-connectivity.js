// Test simple para verificar la conectividad con el backend
console.log('🔍 Probando conectividad con el backend...');

fetch('http://localhost:8080/api/health')
  .then(response => {
    console.log('✅ Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Respuesta del backend:', data);
  })
  .catch(error => {
    console.error('❌ Error al conectar con el backend:', error);
  });

// Probar registro
console.log('🔍 Probando registro...');
fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test' + Date.now() + '@example.com',
    password: 'test123',
    fullName: 'Usuario Prueba'
  })
})
.then(response => {
  console.log('✅ Status registro:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Respuesta registro:', data);
})
.catch(error => {
  console.error('❌ Error en registro:', error);
});
