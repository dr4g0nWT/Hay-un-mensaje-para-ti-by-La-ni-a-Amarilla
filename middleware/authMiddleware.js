// Middleware para usuarios NO logueados (Invitados)
// Si ya estás logueado y tratas de entrar aquí, te mando a la Home.
exports.isGuest = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next(); // Si no hay sesión, continúa a la vista de login/register
};

// Middleware para usuarios LOGUEADOS (Autenticados)
// Lo usaremos pronto para proteger el "Buzón". Si no estás logueado, te manda al Login.
exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next(); // Si hay sesión, continúa a la zona privada
};