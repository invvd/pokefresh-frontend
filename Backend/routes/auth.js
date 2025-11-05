const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Session = require('../models/Session');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'pokefresh2025';
const TOKEN_TTL = parseInt(process.env.TOKEN_TTL_SECONDS || '86400');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_TTL * 1000).toISOString();

    // Guardar sesión
    const session = new Session({
      token,
      username,
      expires_at: expiresAt
    });
    await session.save();

    res.json({
      token,
      expires_in: TOKEN_TTL,
      username
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware para validar token
const validateToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authorization.split(' ')[1];
    const session = await Session.findOne({ token });

    if (!session) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Verificar expiración
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    if (now > expiresAt) {
      await Session.deleteOne({ token });
      return res.status(401).json({ error: 'Token expirado' });
    }

    req.user = { username: session.username };
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { router, validateToken };