import { Router } from 'express';
import {
    register,
    login,
    logout,
    getMe,
    registerValidation,
    loginValidation
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario en BILLIWING
 * @access  Public
 */
router.post('/api/auth/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión en BILLIWING
 * @access  Public
 */
router.post('/api/auth/login', loginValidation, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/api/auth/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información del usuario actual
 * @access  Private
 */
router.get('/api/auth/me', authenticateToken, getMe);

/**
 * @route   GET /api/auth/status
 * @desc    Verificar estado de la API de autenticación
 * @access  Public
 */
router.get('/api/auth/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API de autenticación BILLIWING funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

export default router;