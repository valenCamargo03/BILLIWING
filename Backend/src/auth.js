import { verifyToken, extractToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Middleware de autenticación JWT para BILLIWING
 * Verifica que el usuario esté autenticado con un token válido
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Extraer token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = extractToken(authHeader);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido',
                error: 'NO_TOKEN'
            });
        }

        // Verificar el token
        const decoded = verifyToken(token);
        
        // Buscar el usuario en la base de datos
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado',
                error: 'USER_NOT_FOUND'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo',
                error: 'USER_INACTIVE'
            });
        }

        // Agregar datos del usuario a la request
        req.user = user.getPublicData();
        req.userId = user.id;
        
        next();
    } catch (error) {
        console.error('Error en autenticación:', error.message);
        
        // Manejar diferentes tipos de errores JWT
        if (error.message.includes('expired')) {
            return res.status(401).json({
                success: false,
                message: 'Token expirado',
                error: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.message.includes('invalid') || error.message.includes('malformed')) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                error: 'INVALID_TOKEN'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Error de autenticación',
            error: 'AUTH_ERROR'
        });
    }
};

/**
 * Middleware opcional de autenticación
 * Agrega información del usuario si está autenticado, pero no requiere autenticación
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = extractToken(authHeader);

        if (!token) {
            req.user = null;
            req.userId = null;
            return next();
        }

        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.userId);
        
        if (user && user.isActive) {
            req.user = user.getPublicData();
            req.userId = user.id;
        } else {
            req.user = null;
            req.userId = null;
        }
        
        next();
    } catch (error) {
        // En caso de error, continuar sin autenticación
        req.user = null;
        req.userId = null;
        next();
    }
};

/**
 * Middleware para verificar permisos de administrador
 */
export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Autenticación requerida',
                error: 'NO_AUTH'
            });
        }

        // Por ahora, simplemente verificamos que el usuario esté autenticado
        // En el futuro se puede agregar un campo 'role' o 'isAdmin' al modelo User
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error verificando permisos',
            error: 'PERMISSION_ERROR'
        });
    }
};

export default {
    authenticateToken,
    optionalAuth,
    requireAdmin
};