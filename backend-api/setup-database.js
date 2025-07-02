import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la base de datos
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Conectar primero a la BD por defecto
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

const targetDatabase = process.env.DB_DATABASE || 'asistente_virtual_db';

async function setupDatabase() {
  console.log('🚀 Iniciando configuración de la base de datos...\n');

  // Crear pool de conexión inicial
  const pool = new Pool(dbConfig);

  try {
    // 1. Verificar conexión
    console.log('📡 Verificando conexión a PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a PostgreSQL\n');

    // 2. Crear base de datos si no existe
    console.log(`📊 Verificando si existe la base de datos '${targetDatabase}'...`);
    const dbExists = await pool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDatabase]
    );

    if (dbExists.rows.length === 0) {
      console.log(`📊 Creando base de datos '${targetDatabase}'...`);
      await pool.query(`CREATE DATABASE ${targetDatabase}`);
      console.log('✅ Base de datos creada exitosamente\n');
    } else {
      console.log('✅ La base de datos ya existe\n');
    }

    // Cerrar conexión inicial
    await pool.end();

    // 3. Conectar a la base de datos objetivo
    console.log(`🔗 Conectando a la base de datos '${targetDatabase}'...`);
    const targetPool = new Pool({
      ...dbConfig,
      database: targetDatabase
    });

    // 4. Ejecutar script de inicialización
    console.log('📜 Ejecutando script de inicialización...');
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'database', 'init.sql'),
      'utf8'
    );

    await targetPool.query(sqlScript);
    console.log('✅ Script de inicialización ejecutado exitosamente\n');

    // 5. Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...');
    const tables = await targetPool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    console.log('📋 Tablas encontradas:');
    tables.rows.forEach(row => {
      console.log(`   • ${row.tablename}`);
    });

    // 6. Verificar datos iniciales
    console.log('\n📊 Verificando datos iniciales...');
    const userCount = await targetPool.query('SELECT COUNT(*) FROM users');
    const serviceCount = await targetPool.query('SELECT COUNT(*) FROM available_services');
    const gatewayCount = await targetPool.query('SELECT COUNT(*) FROM payment_gateways');

    console.log(`   • Usuarios: ${userCount.rows[0].count}`);
    console.log(`   • Servicios disponibles: ${serviceCount.rows[0].count}`);
    console.log(`   • Gateways de pago: ${gatewayCount.rows[0].count}`);

    // 7. Mostrar credenciales de prueba
    console.log('\n🔑 Credenciales de prueba:');
    console.log('   👑 Admin: admin@asistentevirtual.com / admin123');
    console.log('   👤 Cliente: cliente@test.com / admin123');

    await targetPool.end();

    console.log('\n🎉 ¡Base de datos configurada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Ejecutar: npm start');
    console.log('   2. Probar: http://localhost:8080/api/health');
    console.log('   3. Iniciar frontend en puerto 5173');

  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Soluciones posibles:');
      console.log('   • Verificar que PostgreSQL esté instalado y corriendo');
      console.log('   • Verificar las credenciales en el archivo .env');
      console.log('   • Verificar que el puerto 5432 esté disponible');
    }
    
    process.exit(1);
  }
}

// Ejecutar configuración
setupDatabase();