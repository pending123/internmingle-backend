const express = require('express');
const router = express.Router();
const { requireAuth  } = require('@clerk/express');
const commentController = require('../controllers/commentController')

router.get('/:forumId/comments', commentController.getAllComments)
router.post('/:forumId/comments', requireAuth(), commentController.createComment)
router.delete('/:commentId', requireAuth(), commentController.deleteComment)

module.exports= router