const mysql = require('mysql2');
require('dotenv').config(); // Carga las variables del archivo .env

// Creamos el Pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Máximo 10 conexiones simultáneas
    queueLimit: 0
});

// Convertimos el pool para poder usar promesas (async/await)
// Esto nos permitirá hacer: const [rows] = await db.query(...)
const promisePool = pool.promise();

// Mensaje de prueba al iniciar (opcional)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a la BD:', err.code);
    } else {
        console.log('✅ Conectado exitosamente a la Base de Datos MySQL');
        connection.release();
    }
});

module.exports = promisePool;