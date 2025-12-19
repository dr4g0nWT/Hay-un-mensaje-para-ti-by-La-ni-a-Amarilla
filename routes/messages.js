const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/save', isAuthenticated, messageController.saveMessage);
router.post('/toggle-favorite', isAuthenticated, messageController.toggleFavorite);
router.post('/delete', isAuthenticated, messageController.deleteMessage);

module.exports = router;
