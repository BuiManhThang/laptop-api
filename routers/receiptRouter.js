const router = require('express').Router();
const receiptController = require('../controllers/receiptController');
const auth = require('../controllers/auth');

router.post('/create', auth.authorization, receiptController.receipt_create);

router.get('/list/:user', auth.authorization, receiptController.receipt_list);

module.exports = router;