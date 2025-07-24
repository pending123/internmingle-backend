const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController')
const { requireAuth  } = require('@clerk/express');


router.get('/events', eventController.getEvents)
router.get('/events/:id', eventController.getEventById)
router.post('/events', requireAuth(), eventController.createEvent)
router.put('/events/:id', requireAuth(), eventController.updateEvent)
router.delete('/events/:id', requireAuth(), eventController.deleteEvent)

module.exports =router