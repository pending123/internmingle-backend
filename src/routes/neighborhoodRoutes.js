const express = require('express');
const router = express.Router();
const neighborhoodController = require('../controllers/neighborhoodController')

router.get('/', neighborhoodController.getNeighborhoodData);

module.exports = router;