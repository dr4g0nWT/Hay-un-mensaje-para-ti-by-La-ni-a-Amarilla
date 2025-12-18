const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
// Importamos los middlewares
const { isGuest, isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', pageController.home);
router.get('/register', isGuest, pageController.showRegister);
router.get('/login', isGuest, pageController.showLogin);

// --- NUEVA RUTA DEL BUZÓN ---
router.get('/buzon', isAuthenticated, pageController.mailbox);

module.exports = router;