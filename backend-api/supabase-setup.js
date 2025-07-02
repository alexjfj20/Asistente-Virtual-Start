import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
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

async function setupSupabaseDatabase() {
  console.log('🚀 Configurando base de datos de Supabase...\n');

  if (!process.env.DB_PASSWORD) {
    console.log('❌ Error: DB_PASSWORD no está configurado en .env');
    console.log('💡 Por favor, configura tu contraseña de Supabase en el archivo .env');
    console.log('   DB_PASSWORD=tu_password_de_supabase');
    return;
  }

  const pool = new Pool(supabaseConfig);

  try {
    // 1. Verificar conexión a Supabase
    console.log('📡 Verificando conexión a Supabase...');
    const connectionTest = await pool.query('SELECT NOW(), VERSION()');
    console.log('✅ Conexión exitosa a Supabase');
    console.log(`🕐 Hora del servidor: ${connectionTest.rows[0].now}`);
    console.log(`📊 Versión PostgreSQL: ${connectionTest.rows[0].version.split(' ')[0]}\n`);

    // 2. Verificar si las tablas ya existen
    console.log('🔍 Verificando tablas existentes...');
    const existingTables = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'available_services', 'client_services', 'payment_gateways')
      ORDER BY tablename
    `);

    if (existingTables.rows.length > 0) {
      console.log('📋 Tablas encontradas:');
      existingTables.rows.forEach(row => {
        console.log(`   • ${row.tablename}`);
      });
      console.log('\n⚠️  Las tablas ya existen. ¿Deseas recrearlas? (Esto eliminará todos los datos)');
      console.log('💡 Si quieres continuar sin recrear, presiona Ctrl+C');
      console.log('🔄 Para recrear las tablas, continúa...\n');
    }

    // 3. Ejecutar script de inicialización
    console.log('📜 Ejecutando script de inicialización...');
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'database', 'init.sql'),
      'utf8'
    );

    // Dividir el script en comandos individuales para mejor manejo de errores
    const commands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const command of commands) {
      try {
        if (command.trim()) {
          await pool.query(command);
          successCount++;
        }
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.log(`⚠️  Advertencia en comando: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`✅ Script ejecutado: ${successCount} comandos exitosos, ${errorCount} advertencias\n`);

    // 4. Verificar que las tablas se crearon correctamente
    console.log('🔍 Verificando estructura de la base de datos...');
    const tables = await pool.query(`
      SELECT 
        tablename,
        schemaname
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);

    console.log('📋 Tablas en la base de datos:');
    tables.rows.forEach(row => {
      console.log(`   • ${row.tablename}`);
    });

    // 5. Verificar datos iniciales
    console.log('\n📊 Verificando datos iniciales...');
    
    try {
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      const serviceCount = await pool.query('SELECT COUNT(*) FROM available_services');
      const gatewayCount = await pool.query('SELECT COUNT(*) FROM payment_gateways');

      console.log(`   • Usuarios: ${userCount.rows[0].count}`);
      console.log(`   • Servicios disponibles: ${serviceCount.rows[0].count}`);
      console.log(`   • Gateways de pago: ${gatewayCount.rows[0].count}`);

      // 6. Mostrar usuarios de prueba
      const testUsers = await pool.query(`
        SELECT email, full_name, role 
        FROM users 
        WHERE email IN ('admin@asistentevirtual.com', 'cliente@test.com')
      `);

      if (testUsers.rows.length > 0) {
        console.log('\n🔑 Usuarios de prueba disponibles:');
        testUsers.rows.forEach(user => {
          console.log(`   ${user.role === 'admin' ? '👑' : '👤'} ${user.full_name}: ${user.email} / admin123`);
        });
      }

    } catch (error) {
      console.log('⚠️  No se pudieron verificar los datos iniciales:', error.message);
    }

    await pool.end();

    console.log('\n🎉 ¡Base de datos de Supabase configurada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Verificar que el backend se conecte: npm start');
    console.log('   2. Probar endpoint: http://localhost:8080/api/health');
    console.log('   3. Iniciar frontend: cd ../asistente-virtual-start && npm run dev');
    console.log('\n🔗 Tu base de datos Supabase está lista en:');
    console.log(`   📊 Host: ${supabaseConfig.host}`);
    console.log(`   🗄️  Database: ${supabaseConfig.database}`);

  } catch (error) {
    console.error('❌ Error configurando Supabase:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Soluciones posibles:');
      console.log('   • Verificar que la URL de Supabase sea correcta');
      console.log('   • Verificar las credenciales en el archivo .env');
      console.log('   • Verificar que Supabase esté activo');
    } else if (error.code === '28P01') {
      console.log('\n💡 Error de autenticación:');
      console.log('   • Verificar la contraseña en DB_PASSWORD');
      console.log('   • Verificar el usuario en DB_USER');
    } else if (error.code === '3D000') {
      console.log('\n💡 Base de datos no encontrada:');
      console.log('   • Verificar el nombre de la base de datos');
      console.log('   • Usar "postgres" como nombre de base de datos por defecto');
    }
    
    process.exit(1);
  }
}

// Ejecutar configuración
setupSupabaseDatabase();