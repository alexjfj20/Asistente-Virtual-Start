import express from 'express';
import { pool } from '../server.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Obtener todos los servicios disponibles (público)
router.get('/available', async (req, res) => {
  try {
    // Por ahora devolvemos servicios de ejemplo basados en tu frontend
    const availableServices = [
      {
        id: 1,
        name: 'Asesoría Inicial',
        description: 'Sesión de orientación profesional personalizada',
        price: 50.00,
        duration: '1 hora',
        category: 'Consultoría',
        features: [
          'Análisis de perfil profesional',
          'Identificación de fortalezas y áreas de mejora',
          'Plan de desarrollo personalizado',
          'Recomendaciones de carrera'
        ]
      },
      {
        id: 2,
        name: 'Optimización de CV',
        description: 'Mejora tu currículum para destacar ante los reclutadores',
        price: 75.00,
        duration: '2-3 días laborales',
        category: 'Documentos',
        features: [
          'Análisis detallado del CV actual',
          'Reestructuración del contenido',
          'Optimización para ATS',
          'Diseño profesional',
          '2 revisiones incluidas'
        ]
      },
      {
        id: 3,
        name: 'Preparación para Entrevistas',
        description: 'Entrena para conseguir el trabajo de tus sueños',
        price: 100.00,
        duration: '1-2 sesiones',
        category: 'Entrenamiento',
        features: [
          'Simulacros de entrevista',
          'Técnicas de comunicación',
          'Manejo de preguntas difíciles',
          'Lenguaje corporal',
          'Seguimiento post-entrevista'
        ]
      },
      {
        id: 4,
        name: 'Búsqueda Activa de Empleo',
        description: 'Estrategia completa para encontrar oportunidades',
        price: 150.00,
        duration: '2 semanas',
        category: 'Estrategia',
        features: [
          'Identificación de oportunidades',
          'Estrategia de networking',
          'Optimización de LinkedIn',
          'Seguimiento de aplicaciones',
          'Negociación salarial'
        ]
      },
      {
        id: 5,
        name: 'Coaching Profesional Completo',
        description: 'Acompañamiento integral en tu desarrollo profesional',
        price: 300.00,
        duration: '1 mes',
        category: 'Premium',
        features: [
          'Todos los servicios anteriores incluidos',
          'Sesiones semanales de seguimiento',
          'Acceso prioritario al coach',
          'Materiales adicionales',
          'Garantía de satisfacción'
        ]
      }
    ];

    res.status(200).json({
      services: availableServices,
      totalServices: availableServices.length
    });

  } catch (error) {
    console.error('Error obteniendo servicios disponibles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Contratar un servicio (requiere autenticación)
router.post('/hire', authenticateToken, async (req, res) => {
  try {
    const { serviceId, notes } = req.body;

    if (!serviceId) {
      return res.status(400).json({ error: 'ID del servicio es obligatorio' });
    }

    // Obtener información del servicio
    const availableServices = [
      { id: 1, name: 'Asesoría Inicial', price: 50.00 },
      { id: 2, name: 'Optimización de CV', price: 75.00 },
      { id: 3, name: 'Preparación para Entrevistas', price: 100.00 },
      { id: 4, name: 'Búsqueda Activa de Empleo', price: 150.00 },
      { id: 5, name: 'Coaching Profesional Completo', price: 300.00 }
    ];

    const service = availableServices.find(s => s.id === parseInt(serviceId));
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Crear el servicio contratado
    const hiredService = await pool.query(`
      INSERT INTO client_services 
      (client_id, service_type, status, price, payment_status, notes, created_at, estimated_delivery_date)
      VALUES ($1, $2, 'Pendiente', $3, 'Pendiente', $4, NOW(), NOW() + INTERVAL '7 days')
      RETURNING id, service_type, status, price, payment_status, created_at, estimated_delivery_date
    `, [req.user.userId, service.name, service.price, notes || null]);

    res.status(201).json({
      message: 'Servicio contratado exitosamente',
      service: {
        id: hiredService.rows[0].id,
        serviceType: hiredService.rows[0].service_type,
        status: hiredService.rows[0].status,
        price: hiredService.rows[0].price,
        paymentStatus: hiredService.rows[0].payment_status,
        createdAt: hiredService.rows[0].created_at,
        estimatedDeliveryDate: hiredService.rows[0].estimated_delivery_date,
        notes: notes || null
      }
    });

  } catch (error) {
    console.error('Error contratando servicio:', error);
    
    // Si la tabla no existe, devolver respuesta simulada
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return res.status(201).json({
        message: 'Servicio contratado exitosamente (simulado)',
        service: {
          id: Math.floor(Math.random() * 1000),
          serviceType: 'Servicio de Prueba',
          status: 'Pendiente',
          price: 50.00,
          paymentStatus: 'Pendiente',
          createdAt: new Date().toISOString(),
          estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: req.body.notes || null
        },
        note: 'Tabla de servicios no existe aún - respuesta simulada'
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener detalles de un servicio específico
router.get('/:serviceId', authenticateToken, async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await pool.query(`
      SELECT 
        cs.id,
        cs.service_type,
        cs.status,
        cs.price,
        cs.payment_status,
        cs.created_at,
        cs.updated_at,
        cs.notes,
        cs.estimated_delivery_date,
        u.full_name as client_name,
        u.email as client_email
      FROM client_services cs
      JOIN users u ON cs.client_id = u.id
      WHERE cs.id = $1 AND cs.client_id = $2
    `, [serviceId, req.user.userId]);

    if (service.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.status(200).json({
      service: {
        id: service.rows[0].id,
        serviceType: service.rows[0].service_type,
        status: service.rows[0].status,
        price: service.rows[0].price,
        paymentStatus: service.rows[0].payment_status,
        createdAt: service.rows[0].created_at,
        updatedAt: service.rows[0].updated_at,
        notes: service.rows[0].notes,
        estimatedDeliveryDate: service.rows[0].estimated_delivery_date,
        client: {
          name: service.rows[0].client_name,
          email: service.rows[0].client_email
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo detalles del servicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
