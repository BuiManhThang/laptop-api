const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../controllers/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, './public/images/users');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage: storage});

router.post('/register', userController.user_register);

router.post('/signin', userController.user_signin);

router.put('/update', upload.single('avata'), auth.authorization, userController.user_update);

router.get('/logout', auth.authorization, userController.user_logout);

router.get('/info', auth.authorization, userController.user_info);

module.exports = router;