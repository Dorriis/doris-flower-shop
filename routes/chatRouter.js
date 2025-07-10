const express = require('express');
const { handleChatMessage } = require('../controllers/chatController');
const router = express.Router();
router.post('/chatbox', handleChatMessage);

module.exports = router;
