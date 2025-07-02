-- Script de inicialización de la base de datos para Asistente Virtual Start
-- Ejecutar este script en tu instancia de PostgreSQL

-- Crear la base de datos si no existe
-- CREATE DATABASE asistente_virtual_db;

-- Conectar a la base de datos
-- \c asistente_virtual_db;

-- Crear extensión para UUIDs (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (clientes y administradores)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios disponibles
CREATE TABLE IF NOT EXISTS available_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100),
    category VARCHAR(100),
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios contratados por clientes
CREATE TABLE IF NOT EXISTS client_services (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES available_services(id),
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Progreso', 'Completada', 'Cancelada')),
    price DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pendiente' CHECK (payment_status IN ('Pendiente', 'Pagado', 'Reembolsado')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    notes TEXT,
    estimated_delivery_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para solicitudes de actualización de servicios
CREATE TABLE IF NOT EXISTS service_update_requests (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES client_services(id) ON DELETE CASCADE,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_response TEXT,
    admin_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de gateways de pago (para admin)
CREATE TABLE IF NOT EXISTS payment_gateways (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    configuration JSONB,
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs de transacciones (para auditoria)
CREATE TABLE IF NOT EXISTS transaction_logs (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES client_services(id),
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2),
    gateway_used VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para sesiones de usuario (opcional, para manejo avanzado de sesiones)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_client_services_client_id ON client_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_services_status ON client_services(status);
CREATE INDEX IF NOT EXISTS idx_client_services_payment_status ON client_services(payment_status);
CREATE INDEX IF NOT EXISTS idx_client_services_created_at ON client_services(created_at);
CREATE INDEX IF NOT EXISTS idx_service_update_requests_service_id ON service_update_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_service_update_requests_status ON service_update_requests(status);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_service_id ON transaction_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_user_id ON transaction_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_available_services_updated_at BEFORE UPDATE ON available_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_services_updated_at BEFORE UPDATE ON client_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_update_requests_updated_at BEFORE UPDATE ON service_update_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at BEFORE UPDATE ON payment_gateways
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar un usuario administrador por defecto
-- La contraseña es 'admin123' (cambiar inmediatamente en producción)
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified) 
VALUES (
    'admin@asistentevirtual.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNbpEDbNK8/aq', -- admin123
    'Administrador del Sistema',
    'admin',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insertar usuario de prueba para desarrollo
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified) 
VALUES (
    'cliente@test.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNbpEDbNK8/aq', -- admin123
    'Cliente de Prueba',
    'client',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insertar servicios disponibles
INSERT INTO available_services (name, description, price, duration, category, features, is_active) VALUES 
(
    'Plan Todo-en-Uno - Carrera Remota',
    'Acceso completo a todas nuestras herramientas y servicios de IA para impulsar tu carrera como Asistente Virtual.',
    17.00,
    'mensual',
    'Premium',
    '["Optimización de CV con IA", "Preparación para entrevistas", "Búsqueda activa de empleo", "Evaluación de perfil freelance", "Evaluación para call centers", "Coaching profesional personalizado", "Acceso a todas las herramientas IA", "Soporte prioritario 24/7"]',
    true
),
(
    'Asesoría Inicial',
    'Sesión de orientación profesional personalizada para comenzar tu carrera como Asistente Virtual.',
    50.00,
    '1 hora',
    'Consultoría',
    '["Análisis de perfil profesional", "Identificación de fortalezas y áreas de mejora", "Plan de desarrollo personalizado", "Recomendaciones de carrera"]',
    true
),
(
    'Optimización de CV',
    'Mejora tu currículum para destacar ante los reclutadores y sistemas ATS.',
    75.00,
    '2-3 días laborales',
    'Documentos',
    '["Análisis detallado del CV actual", "Reestructuración del contenido", "Optimización para ATS", "Diseño profesional", "2 revisiones incluidas"]',
    true
) ON CONFLICT DO NOTHING;

-- Insertar configuraciones de gateway de pago por defecto
INSERT INTO payment_gateways (name, display_name, is_enabled, configuration, logo_url) VALUES 
(
    'stripe',
    'Stripe',
    false,
    '{"public_key": "", "secret_key": "", "webhook_secret": ""}',
    'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg'
),
(
    'mercadopago',
    'MercadoPago',
    false,
    '{"access_token": "", "public_key": "", "webhook_url": ""}',
    'https://img.stackshare.io/service/2721/mercadopago.png'
),
(
    'paypal',
    'PayPal',
    false,
    '{"client_id": "", "client_secret": "", "mode": "sandbox"}',
    'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png'
),
(
    'nequi',
    'Nequi',
    false,
    '{"phone_number": "", "webhook_url": ""}',
    'https://seeklogo.com/images/N/nequi-logo-85F39E2F5E-seeklogo.com.png'
),
(
    'daviplata',
    'DaviPlata',
    false,
    '{"phone_number": "", "webhook_url": ""}',
    'https://seeklogo.com/images/D/daviplata-logo-6F3E1E5E5E-seeklogo.com.png'
)
ON CONFLICT (name) DO NOTHING;

-- Insertar algunos servicios de ejemplo para el cliente de prueba
INSERT INTO client_services (client_id, service_type, status, price, payment_status, notes, estimated_delivery_date) VALUES 
(
    (SELECT id FROM users WHERE email = 'cliente@test.com'),
    'Asesoría Inicial',
    'Completada',
    50.00,
    'Pagado',
    'Sesión de orientación completada exitosamente. Cliente muy satisfecho con las recomendaciones.',
    CURRENT_DATE - INTERVAL '5 days'
),
(
    (SELECT id FROM users WHERE email = 'cliente@test.com'),
    'Optimización de CV',
    'En Progreso',
    75.00,
    'Pagado',
    'CV en proceso de optimización. Esperando documentos adicionales del cliente.',
    CURRENT_DATE + INTERVAL '3 days'
);

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema (clientes y administradores)';
COMMENT ON TABLE available_services IS 'Catálogo de servicios disponibles para contratar';
COMMENT ON TABLE client_services IS 'Servicios contratados por los clientes';
COMMENT ON TABLE service_update_requests IS 'Solicitudes de actualización de servicios enviadas por clientes';
COMMENT ON TABLE payment_gateways IS 'Configuración de gateways de pago disponibles';
COMMENT ON TABLE transaction_logs IS 'Logs de transacciones para auditoria';
COMMENT ON TABLE user_sessions IS 'Sesiones activas de usuarios para manejo de tokens';

-- Mostrar resumen de tablas creadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'available_services', 'client_services', 'service_update_requests', 'payment_gateways', 'transaction_logs', 'user_sessions')
ORDER BY tablename;

-- Verificar que los datos se insertaron correctamente
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Available Services', COUNT(*) FROM available_services
UNION ALL
SELECT 'Client Services', COUNT(*) FROM client_services
UNION ALL
SELECT 'Payment Gateways', COUNT(*) FROM payment_gateways;