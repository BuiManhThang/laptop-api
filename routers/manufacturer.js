const manufacturerController = require('../controllers/manufacturerController');
const express = require('express');
const router = express.Router();

router.get('/list', manufacturerController.list);

module.exports = router;