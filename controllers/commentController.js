const Comment = require('../models/comment');
const User = require('../models/user');
const {body, validationResult} = require('express-validator');

exports.comment_create = [
    body('text').trim().isLength({min: 1}).withMessage('Your comment is empty').escape(),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.json({errors: errors.array()});
            }
            const user = await User.findById(req.body.userId);
            if(!user) {
                return res.status(401).json({message: 'Please sign in to comment'});
            }
            const comment = new Comment({
                user: user._id,
                text: req.body.text,
                product: req.body.productId,
                likes: [],
                dislikes: []
            });
    
            const newComment = await comment.save();

            const theComment = await Comment.findById(newComment._id).populate('user');

            res.json(theComment);

        } catch(err) {
            res.status(501).json(err);
        }
    }
]

exports.comment_list = async (req, res) => {
    try {
        const comments = await Comment.find({product: req.params.product}).populate('user');
        res.json(comments);
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.comment_delete = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if(!user) {
            return res.status(401).json({message: 'You dont have permission'});
        }
        const deletedComment = await Comment.deleteOne({_id: req.params.id});
        res.json(deletedComment);
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.comment_like = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if(!user) {
            return res.status(401).json({message: 'Please sign in to like this comment'});
        }
        const comment = await Comment.findById(req.body.id).populate('user');
        if(comment.likes.indexOf(req.body.userId) > -1) {
            await Comment.updateOne({_id: req.body.id}, {$pull: {likes: req.body.userId}});
            comment.likes = comment.likes.filter(userLike => {
                return userLike.toString() !== req.body.userId;
            })
            return res.json(comment);
        }
        await Comment.updateOne({_id: req.body.id}, {$push: {likes: req.body.userId}});
        comment.likes = [...comment.likes, req.body.userId];
        res.json(comment);
    } catch(err) {
        res.status(501).json(err);
    }
}

exports.comment_dislike = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if(!user) {
            return res.status(401).json({message: 'Please sign in to dislike this comment'});
        }
        const comment = await Comment.findById(req.body.id).populate('user');
        if(comment.dislikes.indexOf(req.body.userId) > -1) {
            await Comment.updateOne({_id: req.body.id}, {$pull: {dislikes: req.body.userId}});
            comment.dislikes = comment.dislikes.filter(userDislike => {
                return userDislike.toString() !== req.body.userId;
            })
            return res.json(comment);
        }
        await Comment.updateOne({_id: req.body.id}, {$push: {dislikes: req.body.userId}});
        comment.dislikes = [...comment.dislikes, req.body.userId];
        res.json(comment);
    } catch(err) {
        res.status(501).json(err);
    }
}