const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    // A. Validación en el Servidor
    if (password !== confirm_password) {
        // Podrías renderizar de nuevo register pasando el mensaje de error
        return res.send('Error: Las contraseñas no coinciden.');
    }

    // Regex de seguridad
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-_#])[A-Za-z\d@$!%*?&.\-_#]{10,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.send('Error: La contraseña no es segura. Intenta de nuevo.');
    }

    try {
        // B. Hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // C. Guardar en Base de Datos (Simulación)
        // Aquí llamarás a tu modelo de MySQL en el futuro
        console.log("--- NUEVO USUARIO REGISTRADO (MVC) ---");
        console.log("Usuario:", username);
        console.log("Hash:", hashedPassword);

        // Redirigir al login tras éxito
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor.');
    }
};

exports.login = (req, res) => {
    // Aquí conectarás la verificación con MySQL más adelante
    console.log("Login simulado exitoso");
    res.redirect('/');
};

exports.logout = (req, res) => {
    // Aquí destruirás la sesión en el futuro
    res.redirect('/');
};