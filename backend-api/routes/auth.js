import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../server.js';
import validator from 'validator';

const router = express.Router();

// Middleware para validar el token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validaciones
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Email, contraseña y nombre completo son obligatorios' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario en la base de datos
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id, email, full_name, phone, created_at`,
      [email.toLowerCase(), hashedPassword, fullName, phone]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: newUser.rows[0].id, 
        email: newUser.rows[0].email,
        role: 'client'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        fullName: newUser.rows[0].full_name,
        phone: newUser.rows[0].phone,
        createdAt: newUser.rows[0].created_at
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Buscar usuario en la base de datos
    const user = await pool.query(
      'SELECT id, email, password_hash, full_name, phone, role, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.rows[0].id, 
        email: user.rows[0].email,
        role: user.rows[0].role || 'client'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        fullName: user.rows[0].full_name,
        phone: user.rows[0].phone,
        role: user.rows[0].role || 'client',
        createdAt: user.rows[0].created_at
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token (útil para verificar si el usuario sigue autenticado)
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Token válido',
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        fullName: user.rows[0].full_name,
        phone: user.rows[0].phone,
        role: user.rows[0].role || 'client',
        createdAt: user.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
