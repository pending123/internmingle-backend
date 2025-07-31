const express = require('express');
const router = express.Router();
const { requireAuth  } = require('@clerk/express');
const messageController = require('../controllers/messageController');

// GET /api/messages?userId2=2 
router.get('/', requireAuth(), messageController.getMessageHistory);

// GET /api/messages/conversations
router.get('/conversations', requireAuth(), messageController.getConversationPartners);

// POST /api/messages 
router.post('/', requireAuth(), messageController.sendMessage);

module.exports = router;