const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/list', classController.class_list);

module.exports = router;