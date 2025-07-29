const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController')

router.get("/search", photoController.getPhotoSearchResults)

module.exports= router