const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Definimos las rutas y qué función del controlador las maneja
router.get('/', pageController.home);
router.get('/register', pageController.showRegister);
router.get('/login', pageController.showLogin);

module.exports = router;