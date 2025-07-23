const express = require('express');
const router = express.Router();
const traitController = require('../controllers/traitsController');
router.get('/traits', traitController.getAllTraits);
module.exports = router;