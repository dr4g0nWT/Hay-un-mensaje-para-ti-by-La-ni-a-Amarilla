const express = require('express');
const path = require('path');
const app = express();

// Definir el puerto (toma el del entorno o usa el 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (CSS, JS, Img)
// Esto le dice a Express que busque en la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal: Cuando alguien entre a la web, enviamos el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html/index.html'));
});

// (Opcional) Ruta de prueba para el futuro Back-End
app.get('/api/estado', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente', estado: 'OK' });
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});