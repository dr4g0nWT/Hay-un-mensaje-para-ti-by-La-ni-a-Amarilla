const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Inicializar App
const app = express();

// 1. Configuración del Motor de Plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 3. Middlewares
// Parsear datos de formularios (req.body)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Recomendado añadir también para JSON

// 4. Rutas (Importamos los archivos de rutas)
// Usamos '/' para las páginas normales
app.use('/', require('./routes/pages'));

// Usamos '/' también para auth (o podrías usar '/auth' si quisieras /auth/login)
app.use('/', require('./routes/auth'));

// 5. Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});