const express = require('express');
const router = express.Router();
const { requireAuth  } = require('@clerk/express');
const profileController = require('../controllers/profileController');

//create a new user profile
router.post('/', requireAuth(), profileController.createProfile);

//get all profiles with filtering--IDK IF REQUIRE AUTH OR NOT BC you want to be able to access other ppls
router.get('/', profileController.getProfiles);

//get my profile
router.get('/me', requireAuth(), profileController.getCurrentUserProfile);

//update my profile
router.put('/me', requireAuth(), profileController.updateCurrentUserProfile);

//delete my profile
router.delete('/me', requireAuth(), profileController.deleteCurrentUserProfile);

//get someone's profile by id-- PRETTY SURE YOU DON"T NEED TO REQUIRE AUTH
router.get('/:id', profileController.getProfileById);

module.exports = router;