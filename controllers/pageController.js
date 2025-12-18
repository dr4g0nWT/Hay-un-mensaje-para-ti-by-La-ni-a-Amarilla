exports.home = (req, res) => {
    // ELIMINADO: { user: null }
    // Ahora 'user' viaja automáticamente gracias a res.locals en app.js
    res.render('index');
};

exports.showRegister = (req, res) => {
    res.render('register');
};

exports.showLogin = (req, res) => {
    // Si quisieras pasar datos extra (como formData en caso de error), lo harías aquí.
    // Pero NO pases 'user' manualmente.
    res.render('login');
};

exports.mailbox = (req, res) => {
    // Simulamos datos para que veas la tabla llena
    // En el futuro esto vendrá de: await db.query('SELECT * FROM messages...')
    const mockMessages = [
        { id: 1, sender: 'Ana', subject: 'Gracias', date: '2023-12-18' },
        { id: 2, sender: 'Admin', subject: 'Bienvenido', date: '2023-12-10' }
    ];

    res.render('mailbox', {
        user: req.session.user, // Necesario para el Header
        messages: mockMessages
    });
};