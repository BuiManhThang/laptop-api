const router = require('express').Router();
const productController = require('../controllers/productController');

router.get('/search', productController.product_search);

router.get('/:id', productController.product_detail);

router.get('/', productController.product_list);

module.exports = router;
