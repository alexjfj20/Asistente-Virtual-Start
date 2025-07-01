-- Script de inicialización de la base de datos para Asistente Virtual Start
-- Ejecutar este script en tu instancia de Google Cloud SQL (PostgreSQL)

-- Crear extensión para UUIDs (opcional, si quieres usar UUIDs en lugar de enteros)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (clientes y administradores)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios contratados por clientes
CREATE TABLE IF NOT EXISTS client_services (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Progreso', 'Completada', 'Cancelada')),
    price DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pendiente' CHECK (payment_status IN ('Pendiente', 'Pagado', 'Reembolsado')),
    notes TEXT,
    estimated_delivery_date DATE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de gateways de pago (para admin)
CREATE TABLE IF NOT EXISTS payment_gateways (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs de transacciones (opcional, para auditoria)
CREATE TABLE IF NOT EXISTS transaction_logs (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES client_services(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2),
    gateway_used VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_client_services_client_id ON client_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_services_status ON client_services(status);
CREATE INDEX IF NOT EXISTS idx_client_services_created_at ON client_services(created_at);
CREATE INDEX IF NOT EXISTS idx_service_update_requests_service_id ON service_update_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_service_update_requests_status ON service_update_requests(status);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_service_id ON transaction_logs(service_id);

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

CREATE TRIGGER update_client_services_updated_at BEFORE UPDATE ON client_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_update_requests_updated_at BEFORE UPDATE ON service_update_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at BEFORE UPDATE ON payment_gateways
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar un usuario administrador por defecto (cambiar credenciales en producción)
-- La contraseña es 'admin123' (cambiar inmediatamente)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES (
    'admin@asistentevirtual.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBNbpEDbNK8/aq', -- admin123
    'Administrador del Sistema',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insertar configuraciones de gateway de pago por defecto
INSERT INTO payment_gateways (name, is_enabled, configuration) VALUES 
('Stripe', false, '{"public_key": "", "secret_key": "", "webhook_secret": ""}'),
('MercadoPago', false, '{"access_token": "", "public_key": "", "webhook_url": ""}'),
('PayPal', false, '{"client_id": "", "client_secret": "", "mode": "sandbox"}')
ON CONFLICT DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema (clientes y administradores)';
COMMENT ON TABLE client_services IS 'Servicios contratados por los clientes';
COMMENT ON TABLE service_update_requests IS 'Solicitudes de actualización de servicios enviadas por clientes';
COMMENT ON TABLE payment_gateways IS 'Configuración de gateways de pago disponibles';
COMMENT ON TABLE transaction_logs IS 'Logs de transacciones para auditoria';

-- Mostrar resumen de tablas creadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'client_services', 'service_update_requests', 'payment_gateways', 'transaction_logs')
ORDER BY table_name, ordinal_position;
