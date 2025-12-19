const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config(); // Cargar variables de entorno

// --- NUEVOS IMPORTS PARA BD Y SESIONES ---
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./config/db'); // Importamos la conexión (opcional aquí, pero útil saber que existe)

// Inicializar App
const app = express();

// Configuración Motor de Plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares para leer datos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// --- CONFIGURACIÓN DE SESIÓN (ESTO ES LO NUEVO) ---

// Opciones para el guardado en MySQL
const sessionStore = new MySQLStore({
    // Usamos las mismas credenciales del .env
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Opciones extra
    clearExpired: true, // Borrar sesiones expiradas automáticamente
    checkExpirationInterval: 900000, // Chequear cada 15 min
});

app.use(session({
    key: 'nina_session_cookie', // Nombre de la cookie en el navegador
    secret: process.env.SESSION_SECRET,
    store: sessionStore, // ¡Aquí le decimos que use MySQL!
    resave: false,
    saveUninitialized: false, // No guardar sesión si no hay datos (ahorra espacio)
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Duración: 1 día (en milisegundos)
        httpOnly: true, // Seguridad: el JS del navegador no puede leer la cookie
        // secure: true // Poner en 'true' SOLO si usas HTTPS (en producción)
    }
}));

// --- MIDDLEWARE GLOBAL PARA EL USUARIO ---
// Esto hace que la variable 'user' esté disponible en TODAS las vistas EJS
// sin tener que pasarla manualmente en cada res.render
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// --- RUTAS ---
app.use('/', require('./routes/pages'));
app.use('/', require('./routes/auth'));
app.use('/messages', require('./routes/messages'));

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});