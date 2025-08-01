const express = require('express');
const router = express.Router();
const { requireAuth  } = require('@clerk/express');
const upvoteController = require('../controllers/upvoteController')

router.get('/:forumId/upvote/status', requireAuth(), upvoteController.hasUserUpvoted)
router.post('/:forumId/upvote', requireAuth(), upvoteController.upvoteForumPost)
router.delete('/:forumId/upvote', requireAuth(), upvoteController.unUpvoteForumPost)

module.exports= router
