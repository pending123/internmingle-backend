const express = require('express');
const router = express.Router();
const { requireAuth  } = require('@clerk/express');
const messageController = require('../controllers/messageController');

// GET /api/messages?userId1=1&userId2=2 
router.get('/', messageController.getMessageHistory);

// GET /api/messages/conversations/:userId 
router.get('/conversations/:userId', messageController.getConversations);

// POST /api/messages 
router.post('/', messageController.sendMessage);

module.exports = router;