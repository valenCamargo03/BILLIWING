import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Controlador de registro de usuarios para BILLIWING
 * Registra un nuevo usuario en el sistema
 */
export const register = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Datos de registro inválidos',
    
            errors: errors.array()
            });
        }

        const { username, email, password, firstName, lastName } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            where: {
                $or: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(409).json({
                    success: false,
                    message: 'El nombre de usuario ya está registrado',
                    error: 'USERNAME_EXISTS'
                });
            }
            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado',
                    error: 'EMAIL_EXISTS'
                });
            }
        }

        // Crear nuevo usuario
        const newUser = await User.create({
            username,
            email,
            password,
            firstName: firstName || null,
            lastName: lastName || null
        });

        // Generar token JWT
        const token = generateToken(newUser.id, newUser.username);

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente en BILLIWING',
            user: newUser.getPublicData(),
            token
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        // Manejar errores de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de registro inválidos',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Usuario ya existe',
                error: 'USER_EXISTS'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: 'INTERNAL_ERROR'
        });
    }
};

/**
 * Controlador de inicio de sesión para BILLIWING
 * Autentica un usuario con username/email y password
 */
export const login = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Datos de login inválidos',
                errors: errors.array()
            });
        }

        const { identifier, password } = req.body; // identifier puede ser username o email

        // Buscar usuario por username o email
        const user = await User.findOne({
            where: {
                $or: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
                error: 'INVALID_CREDENTIALS'
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo. Contacta al administrador',
                error: 'USER_INACTIVE'
            });
        }

        // Verificar contraseña
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
                error: 'INVALID_CREDENTIALS'
            });
        }

        // Actualizar fecha de último login
        await user.updateLastLogin();

        // Generar token JWT
        const token = generateToken(user.id, user.username);

        // Respuesta exitosa - MENSAJE ESPECÍFICO SOLICITADO
        res.status(200).json({
            success: true,
            message: 'La autenticación es correcta',
            user: user.getPublicData(),
            token
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: 'INTERNAL_ERROR'
        });
    }
};

/**
 * Controlador para cerrar sesión
 * Por ahora solo responde con éxito, en el futuro se puede implementar blacklist de tokens
 */
export const logout = async (req, res) => {
    try {
        // En una implementación completa, aquí se podría:
        // 1. Agregar el token a una blacklist
        // 2. Invalidar tokens de refresh
        // 3. Limpiar cookies de sesión

        res.status(200).json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error cerrando sesión'
        });
    }
};

/**
 * Obtener información del usuario actual
 */
export const getMe = async (req, res) => {
    try {
        // El middleware de autenticación ya verificó el token y agregó req.user
        res.status(200).json({
            success: true,
            message: 'Información del usuario',
            user: req.user
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo información del usuario'
        });
    }
};

/**
 * Validaciones para registro
 */
export const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 64 })
        .withMessage('El nombre de usuario debe tener entre 3 y 64 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('La contraseña debe tener entre 6 y 128 caracteres'),
    
    body('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('El nombre no puede tener más de 50 caracteres'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('El apellido no puede tener más de 50 caracteres')
];

/**
 * Validaciones para login
 */
export const loginValidation = [
    body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Username o email es requerido'),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

export default {
    register,
    login,
    logout,
    getMe,
    registerValidation,
    loginValidation
};