const express = require('express');
const router = express.Router();
const hobbyController = require('../controllers/hobbiesController'); 

router.get('/hobbies', hobbyController.getAllHobbies);

module.exports = router