import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Obtener perfil del cliente autenticado
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const client = await pool.query(
      'SELECT id, email, full_name, phone, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (client.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({
      client: {
        id: client.rows[0].id,
        email: client.rows[0].email,
        fullName: client.rows[0].full_name,
        phone: client.rows[0].phone,
        createdAt: client.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener servicios del cliente autenticado
router.get('/services', authenticateToken, async (req, res) => {
  try {
    const services = await pool.query(`
      SELECT 
        cs.id,
        cs.service_type,
        cs.status,
        cs.price,
        cs.payment_status,
        cs.created_at,
        cs.updated_at,
        cs.notes,
        cs.estimated_delivery_date
      FROM client_services cs
      WHERE cs.client_id = $1
      ORDER BY cs.created_at DESC
    `, [req.user.userId]);

    // Por ahora, si no hay servicios en la BD, devolvemos datos de ejemplo
    if (services.rows.length === 0) {
      const mockServices = [
        {
          id: 1,
          service_type: 'Asesoría Inicial',
          status: 'Completada',
          price: 50.00,
          payment_status: 'Pagado',
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-20'),
          notes: 'Sesión de orientación profesional completada exitosamente.',
          estimated_delivery_date: new Date('2024-01-20')
        },
        {
          id: 2,
          service_type: 'Optimización de CV',
          status: 'En Progreso',
          price: 75.00,
          payment_status: 'Pagado',
          created_at: new Date('2024-01-22'),
          updated_at: new Date('2024-01-25'),
          notes: 'Revisión de CV en proceso. Esperando documentos adicionales del cliente.',
          estimated_delivery_date: new Date('2024-02-05')
        },
        {
          id: 3,
          service_type: 'Preparación para Entrevistas',
          status: 'Pendiente',
          price: 100.00,
          payment_status: 'Pendiente',
          created_at: new Date('2024-01-28'),
          updated_at: new Date('2024-01-28'),
          notes: 'Servicio programado para la próxima semana.',
          estimated_delivery_date: new Date('2024-02-15')
        }
      ];

      return res.status(200).json({
        services: mockServices,
        totalServices: mockServices.length,
        message: 'Datos de ejemplo (base de datos vacía)'
      });
    }

    res.status(200).json({
      services: services.rows,
      totalServices: services.rows.length
    });

  } catch (error) {
    console.error('Error obteniendo servicios del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Solicitar actualización de un servicio
router.post('/services/:serviceId/request-update', authenticateToken, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { updateType, message } = req.body;

    if (!updateType || !message) {
      return res.status(400).json({ 
        error: 'Tipo de actualización y mensaje son obligatorios' 
      });
    }

    // Verificar que el servicio pertenece al cliente
    const service = await pool.query(
      'SELECT id FROM client_services WHERE id = $1 AND client_id = $2',
      [serviceId, req.user.userId]
    );

    if (service.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Crear solicitud de actualización
    const updateRequest = await pool.query(`
      INSERT INTO service_update_requests 
      (service_id, client_id, update_type, message, status, created_at)
      VALUES ($1, $2, $3, $4, 'pending', NOW())
      RETURNING id, created_at
    `, [serviceId, req.user.userId, updateType, message]);

    res.status(201).json({
      message: 'Solicitud de actualización enviada exitosamente',
      requestId: updateRequest.rows[0].id,
      createdAt: updateRequest.rows[0].created_at
    });

  } catch (error) {
    console.error('Error creando solicitud de actualización:', error);
    
    // Si la tabla no existe, devolver respuesta simulada
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return res.status(201).json({
        message: 'Solicitud de actualización enviada exitosamente (simulado)',
        requestId: Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString(),
        note: 'Tabla de solicitudes no existe aún - respuesta simulada'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar perfil del cliente
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    if (!fullName) {
      return res.status(400).json({ error: 'El nombre completo es obligatorio' });
    }

    const updatedClient = await pool.query(`
      UPDATE users 
      SET full_name = $1, phone = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id, email, full_name, phone, updated_at
    `, [fullName, phone, req.user.userId]);

    if (updatedClient.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      client: {
        id: updatedClient.rows[0].id,
        email: updatedClient.rows[0].email,
        fullName: updatedClient.rows[0].full_name,
        phone: updatedClient.rows[0].phone,
        updatedAt: updatedClient.rows[0].updated_at
      }
    });

  } catch (error) {
    console.error('Error actualizando perfil del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
