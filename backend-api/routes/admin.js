import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Middleware para verificar que el usuario es admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

// Obtener todos los clientes (solo admin)
router.get('/clients', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const clients = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.phone,
        u.created_at,
        COUNT(cs.id) as total_services
      FROM users u
      LEFT JOIN client_services cs ON u.id = cs.client_id
      WHERE u.role = 'client' OR u.role IS NULL
      GROUP BY u.id, u.email, u.full_name, u.phone, u.created_at
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const totalCount = await pool.query(`
      SELECT COUNT(*) FROM users 
      WHERE role = 'client' OR role IS NULL
    `);

    res.status(200).json({
      clients: clients.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount.rows[0].count / limit),
        totalClients: parseInt(totalCount.rows[0].count),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    
    // Si la tabla no existe, devolver datos de ejemplo
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      const mockClients = [
        {
          id: 1,
          email: 'cliente1@example.com',
          full_name: 'Juan Pérez',
          phone: '+1234567890',
          created_at: new Date('2024-01-15'),
          total_services: 2
        },
        {
          id: 2,
          email: 'cliente2@example.com',
          full_name: 'María García',
          phone: '+1234567891',
          created_at: new Date('2024-01-20'),
          total_services: 1
        },
        {
          id: 3,
          email: 'cliente3@example.com',
          full_name: 'Carlos López',
          phone: '+1234567892',
          created_at: new Date('2024-01-25'),
          total_services: 3
        }
      ];

      return res.status(200).json({
        clients: mockClients,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalClients: mockClients.length,
          limit: 10
        },
        note: 'Datos de ejemplo (tabla no existe aún)'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los servicios (solo admin)
router.get('/services', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        cs.id,
        cs.service_type,
        cs.status,
        cs.price,
        cs.payment_status,
        cs.created_at,
        cs.updated_at,
        cs.estimated_delivery_date,
        u.full_name as client_name,
        u.email as client_email
      FROM client_services cs
      JOIN users u ON cs.client_id = u.id
    `;
    
    const queryParams = [];
    
    if (status) {
      query += ' WHERE cs.status = $1';
      queryParams.push(status);
    }
    
    query += ' ORDER BY cs.created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const services = await pool.query(query, queryParams);

    let countQuery = 'SELECT COUNT(*) FROM client_services cs';
    let countParams = [];
    
    if (status) {
      countQuery += ' WHERE cs.status = $1';
      countParams.push(status);
    }

    const totalCount = await pool.query(countQuery, countParams);

    res.status(200).json({
      services: services.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount.rows[0].count / limit),
        totalServices: parseInt(totalCount.rows[0].count),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo servicios para admin:', error);
    
    // Si la tabla no existe, devolver datos de ejemplo
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      const mockServices = [
        {
          id: 1,
          service_type: 'Asesoría Inicial',
          status: 'Completada',
          price: 50.00,
          payment_status: 'Pagado',
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-20'),
          estimated_delivery_date: new Date('2024-01-20'),
          client_name: 'Juan Pérez',
          client_email: 'juan@example.com'
        },
        {
          id: 2,
          service_type: 'Optimización de CV',
          status: 'En Progreso',
          price: 75.00,
          payment_status: 'Pagado',
          created_at: new Date('2024-01-22'),
          updated_at: new Date('2024-01-25'),
          estimated_delivery_date: new Date('2024-02-05'),
          client_name: 'María García',
          client_email: 'maria@example.com'
        }
      ];

      return res.status(200).json({
        services: mockServices,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalServices: mockServices.length,
          limit: 10
        },
        note: 'Datos de ejemplo (tabla no existe aún)'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar estado de un servicio (solo admin)
router.patch('/services/:serviceId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['Pendiente', 'En Progreso', 'Completada', 'Cancelada'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Estados válidos: ' + validStatuses.join(', ')
      });
    }

    const updatedService = await pool.query(`
      UPDATE client_services 
      SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
      WHERE id = $3
      RETURNING id, service_type, status, updated_at
    `, [status, notes, serviceId]);

    if (updatedService.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.status(200).json({
      message: 'Estado del servicio actualizado exitosamente',
      service: {
        id: updatedService.rows[0].id,
        serviceType: updatedService.rows[0].service_type,
        status: updatedService.rows[0].status,
        updatedAt: updatedService.rows[0].updated_at
      }
    });

  } catch (error) {
    console.error('Error actualizando estado del servicio:', error);
    
    // Si la tabla no existe, devolver respuesta simulada
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return res.status(200).json({
        message: 'Estado del servicio actualizado exitosamente (simulado)',
        service: {
          id: req.params.serviceId,
          serviceType: 'Servicio de Prueba',
          status: req.body.status,
          updatedAt: new Date().toISOString()
        },
        note: 'Tabla de servicios no existe aún - respuesta simulada'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener estadísticas del dashboard (solo admin)
router.get('/dashboard/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Obtener estadísticas básicas
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'client' OR role IS NULL) as total_clients,
        (SELECT COUNT(*) FROM client_services) as total_services,
        (SELECT COUNT(*) FROM client_services WHERE status = 'Pendiente') as pending_services,
        (SELECT COUNT(*) FROM client_services WHERE status = 'En Progreso') as in_progress_services,
        (SELECT COUNT(*) FROM client_services WHERE status = 'Completada') as completed_services,
        (SELECT COALESCE(SUM(price), 0) FROM client_services WHERE payment_status = 'Pagado') as total_revenue
    `);

    const monthlyRevenue = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(price) as revenue,
        COUNT(*) as services_count
      FROM client_services 
      WHERE payment_status = 'Pagado' 
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);

    res.status(200).json({
      overview: stats.rows[0] || {
        total_clients: 0,
        total_services: 0,
        pending_services: 0,
        in_progress_services: 0,
        completed_services: 0,
        total_revenue: 0
      },
      monthlyRevenue: monthlyRevenue.rows
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    
    // Si las tablas no existen, devolver datos de ejemplo
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return res.status(200).json({
        overview: {
          total_clients: 15,
          total_services: 23,
          pending_services: 3,
          in_progress_services: 5,
          completed_services: 15,
          total_revenue: 1250.00
        },
        monthlyRevenue: [
          { month: '2024-01-01T00:00:00.000Z', revenue: 450.00, services_count: 6 },
          { month: '2023-12-01T00:00:00.000Z', revenue: 800.00, services_count: 10 }
        ],
        note: 'Datos de ejemplo (tablas no existen aún)'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
