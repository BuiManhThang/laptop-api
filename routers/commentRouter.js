const router = require('express').Router();
const commentController = require('../controllers/commentController');
const auth = require('../controllers/auth');

router.post('/create', auth.authorization, commentController.comment_create);

router.put('/like', auth.authorization, commentController.comment_like);

router.put('/dislike', auth.authorization, commentController.comment_dislike);

router.delete('/delete/:id', auth.authorization, commentController.comment_delete);

router.get('/:product', commentController.comment_list);


module.exports = router;