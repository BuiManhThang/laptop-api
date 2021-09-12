const router = require('express').Router();
const productController = require('../controllers/productController');
const auth = require('../controllers/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})


const upload = multer({storage: storage});

router.get('/search', productController.product_search);

router.post('/create', upload.array('imgs', 10), auth.authorization, productController.product_create);

router.get('/:id', productController.product_detail);

router.get('/', productController.product_list);

module.exports = router;
