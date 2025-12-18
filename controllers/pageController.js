exports.home = (req, res) => {
    // Aquí pasamos user: null por ahora (luego vendrá de la sesión)
    res.render('index', { user: null });
};

exports.showRegister = (req, res) => {
    res.render('register');
};

exports.showLogin = (req, res) => {
    res.render('login');
};