require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

require('./config/passport');

const app = express();
connectDB();

// Configuración CORS mejorada
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3006',
    'http://127.0.0.1:3006'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

// Headers adicionales
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
});

// Rutas
app.use('/api/auth', authRoutes);

// server.js - Agrega estas rutas temporales
app.get('/api/devices', (req, res) => {
    res.json([
        { id: 1, name: 'Dispositivo 1', ip: '192.168.1.100', blocked: false },
        { id: 2, name: 'Dispositivo 2', ip: '192.168.1.101', blocked: true }
    ]);
});

app.get('/api/rules', (req, res) => {
    res.json([
        { id: 1, website: 'facebook.com', blocked: true },
        { id: 2, website: 'google.com', blocked: false }
    ]);
});

app.get('/api/schedules', (req, res) => {
    res.json([
        { 
            id: 1, 
            name: 'Bloqueo nocturno', 
            target: '192.168.1.100',
            action: 'block',
            startTime: '22:00',
            endTime: '06:00',
            active: true
        }
    ]);
});
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Red Admin funcionando' });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Acceso no permitido' });
    }

    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Orígenes permitidos:', allowedOrigins);
});