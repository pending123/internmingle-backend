const express = require('express');
const router = express.Router();
const { requireAuth  } = require('@clerk/express');
const forumController = require('../controllers/forumController')

router.get('/', forumController.getAllForums)
router.get('/:id', forumController.getForumById)
router.post('/', requireAuth(),  forumController.createForum)
router.put('/:id', requireAuth(),  forumController.updateForum)
router.delete('/:id', requireAuth(),  forumController.deleteForum)

module.exports = router