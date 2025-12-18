const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');

// Lista negra de dominios temporales
const TEMP_DOMAINS = [
    'yopmail.com', 'yopmail.fr', 'yopmail.net',
    'cool.fr.nf', 'jetable.fr.nf', 'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
    'mailinator.com', '10minutemail.com', 'temp-mail.org', 'guerrillamail.com'
];

exports.register = async (req, res) => {
    // 1. SANITIZACIÓN DE ENTRADA (NUEVO)
    // Aseguramos que los datos sean strings y quitamos espacios sobrantes
    const username = req.body.username ? req.body.username.trim() : '';
    const email = req.body.email ? req.body.email.trim().toLowerCase() : ''; // Email siempre en minúsculas
    const password = req.body.password || '';
    const confirm_password = req.body.confirm_password || '';

    // Guardamos los datos limpios para devolverlos al formulario si hay error
    const formData = { username, email };

    try {
        // --- VALIDACIONES ---

        // A. Campos vacíos
        if (!username || !email || !password) {
            return res.render('register', { error: 'Todos los campos son obligatorios.', formData });
        }

        // B. Contraseñas coinciden
        if (password !== confirm_password) {
            return res.render('register', { error: 'Las contraseñas no coinciden.', formData });
        }

        // C. Complejidad de contraseña
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-_#])[A-Za-z\d@$!%*?&.\-_#]{10,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.render('register', { error: 'La contraseña no es segura (Faltan mayúsculas, números o símbolos).', formData });
        }

        // D. Formato de Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('register', { error: 'El formato del correo no es válido.', formData });
        }

        // E. Dominios Temporales
        const domain = email.split('@')[1];
        if (TEMP_DOMAINS.includes(domain)) {
            return res.render('register', {
                error: 'No se permiten correos temporales. Por favor usa un correo real.',
                formData
            });
        }

        // --- VERIFICACIÓN DE DUPLICADOS (SQL SEGURO) ---
        // El uso de '?' previene SQL Injection aquí
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.render('register', {
                error: 'El correo electrónico o el usuario ya están registrados.',
                formData
            });
        }

        // --- PREPARACIÓN Y GUARDADO ---

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = crypto.randomBytes(32).toString('hex');

        // INSERT (SQL SEGURO)
        // El uso de '?' previene SQL Injection aquí también
        await db.query(
            'INSERT INTO users (username, email, password_hash, is_verified, verification_token) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, 0, emailToken]
        );

        console.log(`✅ Usuario registrado seguro: ${username}`);

        // Éxito
        res.render('login', {
            success: 'Cuenta creada correctamente. Tu seguridad es nuestra prioridad.'
        });

    } catch (error) {
        // Logueamos el error real en el servidor para nosotros
        console.error('❌ Error CRÍTICO en registro:', error);

        // Al usuario solo le mostramos un mensaje genérico (Seguridad por oscuridad: no dar pistas)
        res.render('register', {
            error: 'Ocurrió un problema interno. Por favor inténtalo más tarde.',
            formData
        });
    }
};

// ... Resto de controladores (login, logout) igual ...
exports.login = async (req, res) => {
    // 1. SANITIZACIÓN
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password || '';

    try {
        // 2. VALIDAR CAMPOS VACÍOS
        if (!email || !password) {
            return res.render('login', {
                error: 'Por favor, introduce tu correo y contraseña.',
                formData: { email } // Devolvemos el email para que no tenga que reescribirlo
            });
        }

        // 3. BUSCAR USUARIO EN LA BD
        // Buscamos por email. Usamos '?' para evitar inyección SQL.
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        // Si el array está vacío, el usuario no existe.
        if (users.length === 0) {
            return res.render('login', {
                error: 'El correo electrónico o la contraseña son incorrectos.',
                formData: { email }
            });
        }

        const user = users[0];

        // 4. VERIFICAR CONTRASEÑA (Bcrypt)
        // Comparamos la contraseña plana (password) con el hash de la BD (user.password_hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.render('login', {
                error: 'El correo electrónico o la contraseña son incorrectos.',
                formData: { email }
            });
        }

        // 5. CREAR LA SESIÓN (AQUÍ SE GENERA EL TOKEN)
        // Al escribir en req.session, la librería crea el ID, la Cookie y la entrada en MySQL.
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            is_verified: user.is_verified // Guardamos esto por si quieres limitar acceso en el futuro
        };

        console.log(`🔑 Login exitoso: ${user.username} (ID: ${user.id})`);

        // 6. GUARDAR Y REDIRIGIR
        // save() fuerza a guardar en la BD antes de redirigir para evitar condiciones de carrera
        req.session.save((err) => {
            if (err) {
                console.error('Error guardando sesión:', err);
                return res.render('login', { error: 'Error de conexión. Intenta de nuevo.' });
            }
            // ¡Adentro!
            res.redirect('/');
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.render('login', {
            error: 'Ocurrió un error en el servidor.',
            formData: { email }
        });
    }
};

exports.logout = (req, res) => {
    // Destruye la sesión en el servidor (borra la fila de la tabla sessions)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error cerrando sesión:', err);
            return res.redirect('/');
        }

        // Limpia la cookie en el navegador del usuario
        res.clearCookie('nina_session_cookie');

        console.log('👋 Sesión cerrada');
        res.redirect('/');
    });
};