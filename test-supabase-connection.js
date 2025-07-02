// Test de conexión específico para Supabase
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: 'backend-api/.env' });

console.log('🔍 Probando conexión a Supabase...\n');

const supabaseConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db.nejokwxyjsryuhjbexmd.supabase.co',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

async function testSupabaseConnection() {
  console.log('📊 Configuración de conexión:');
  console.log(`   🏠 Host: ${supabaseConfig.host}`);
  console.log(`   👤 Usuario: ${supabaseConfig.user}`);
  console.log(`   🗄️  Base de datos: ${supabaseConfig.database}`);
  console.log(`   🔌 Puerto: ${supabaseConfig.port}`);
  console.log(`   🔒 SSL: ${supabaseConfig.ssl ? 'Habilitado' : 'Deshabilitado'}`);
  console.log(`   🔑 Contraseña: ${process.env.DB_PASSWORD ? '***configurada***' : '❌ NO CONFIGURADA'}\n`);

  if (!process.env.DB_PASSWORD) {
    console.log('❌ Error: DB_PASSWORD no está configurado');
    console.log('💡 Configura tu contraseña de Supabase en backend-api/.env:');
    console.log('   DB_PASSWORD=tu_password_de_supabase');
    return;
  }

  const pool = new Pool(supabaseConfig);

  try {
    console.log('🔄 Intentando conectar...');
    
    // Test básico de conexión
    const result = await pool.query('SELECT NOW(), VERSION(), current_database()');
    
    console.log('✅ ¡Conexión exitosa a Supabase!');
    console.log(`🕐 Hora del servidor: ${result.rows[0].now}`);
    console.log(`📊 Versión PostgreSQL: ${result.rows[0].version.split(' ')[0]}`);
    console.log(`🗄️  Base de datos actual: ${result.rows[0].current_database}\n`);

    // Verificar tablas existentes
    console.log('🔍 Verificando tablas...');
    const tables = await pool.query(`
      SELECT tablename, schemaname 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    if (tables.rows.length > 0) {
      console.log('📋 Tablas encontradas:');
      tables.rows.forEach(row => {
        console.log(`   • ${row.tablename}`);
      });
    } else {
      console.log('📋 No se encontraron tablas personalizadas');
      console.log('💡 Ejecuta: cd backend-api && npm run setup-supabase');
    }

    // Test de permisos
    console.log('\n🔐 Verificando permisos...');
    try {
      await pool.query('CREATE TABLE IF NOT EXISTS test_permissions (id SERIAL PRIMARY KEY)');
      await pool.query('DROP TABLE IF EXISTS test_permissions');
      console.log('✅ Permisos de escritura: OK');
    } catch (error) {
      console.log('⚠️  Permisos limitados:', error.message);
    }

    await pool.end();

    console.log('\n🎉 ¡Supabase está listo para usar!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. cd backend-api && npm run setup-supabase');
    console.log('   2. npm start');
    console.log('   3. Probar: http://localhost:8080/api/health');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔧 Código de error:', error.code);
    
    switch (error.code) {
      case 'ECONNREFUSED':
        console.log('💡 El servidor rechazó la conexión');
        console.log('   • Verificar que la URL sea correcta');
        console.log('   • Verificar que Supabase esté activo');
        break;
      case '28P01':
        console.log('💡 Error de autenticación');
        console.log('   • Verificar DB_PASSWORD en .env');
        console.log('   • Verificar DB_USER en .env');
        break;
      case '3D000':
        console.log('💡 Base de datos no encontrada');
        console.log('   • Usar "postgres" como DB_DATABASE');
        break;
      case 'ENOTFOUND':
        console.log('💡 Host no encontrado');
        console.log('   • Verificar DB_HOST en .env');
        break;
      default:
        console.log('💡 Error desconocido. Verificar configuración.');
    }
    
    console.log('\n🔧 Configuración actual en .env:');
    console.log(`   DB_HOST=${process.env.DB_HOST || 'NO CONFIGURADO'}`);
    console.log(`   DB_USER=${process.env.DB_USER || 'NO CONFIGURADO'}`);
    console.log(`   DB_DATABASE=${process.env.DB_DATABASE || 'NO CONFIGURADO'}`);
    console.log(`   DB_PASSWORD=${process.env.DB_PASSWORD ? '***configurada***' : 'NO CONFIGURADA'}`);
  }
}

testSupabaseConnection();