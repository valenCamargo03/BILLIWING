import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Importar rutas existentes
import serviciosRoutes from "./routes/servicios.routes.js";
import usuariosRoutes from "./routes/usuarios.router.js";

// Importar nuevas rutas de autenticación
import authRoutes from "./routes/auth.routes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuración CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta de bienvenida para BILLIWING
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido a BILLIWING API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            servicios: '/servicios',
            usuarios: '/usuarios'
        },
        timestamp: new Date().toISOString()
    });
});

// Rutas de autenticación (nuevas)
app.use(authRoutes);

// Rutas existentes de tu proyecto
app.use(serviciosRoutes);
app.use(usuariosRoutes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        error: 'NOT_FOUND'
    });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_ERROR'
    });
});

export default app;

